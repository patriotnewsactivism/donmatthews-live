<?php
/**
 * Plugin Name: Don Matthews Core
 * Description: Structured content and durable lead capture for donmatthews.live.
 * Version: 0.2.0
 * Author: Don Matthews
 * Text Domain: don-matthews-core
 */

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

const DM_CORE_VERSION = '0.2.0';

function dm_leads_table(): string
{
    global $wpdb;
    return $wpdb->prefix . 'dm_leads';
}

add_action('init', static function (): void {
    $types = [
        'dm_project' => [
            'singular' => 'Project',
            'plural'   => 'Projects',
            'slug'     => 'projects',
            'icon'     => 'dashicons-admin-tools',
        ],
        'dm_record' => [
            'singular' => 'Record Entry',
            'plural'   => 'The Record',
            'slug'     => 'record',
            'icon'     => 'dashicons-portfolio',
        ],
        'dm_release' => [
            'singular' => 'Music Release',
            'plural'   => 'Music',
            'slug'     => 'music',
            'icon'     => 'dashicons-format-audio',
        ],
        'dm_appearance' => [
            'singular' => 'Media Appearance',
            'plural'   => 'Press & Media',
            'slug'     => 'press',
            'icon'     => 'dashicons-microphone',
        ],
    ];

    foreach ($types as $postType => $config) {
        register_post_type($postType, [
            'labels' => [
                'name'          => $config['plural'],
                'singular_name' => $config['singular'],
                'add_new_item'  => 'Add New ' . $config['singular'],
                'edit_item'     => 'Edit ' . $config['singular'],
                'view_item'     => 'View ' . $config['singular'],
                'search_items'  => 'Search ' . $config['plural'],
            ],
            'public'             => true,
            'show_in_rest'       => true,
            'has_archive'        => true,
            'rewrite'            => ['slug' => $config['slug'], 'with_front' => false],
            'menu_icon'          => $config['icon'],
            'supports'           => ['title', 'editor', 'excerpt', 'thumbnail', 'revisions', 'author', 'custom-fields'],
            'show_in_nav_menus'  => true,
            'publicly_queryable' => true,
        ]);
    }

    register_taxonomy('dm_project_type', ['dm_project'], [
        'labels' => ['name' => 'Project Types', 'singular_name' => 'Project Type'],
        'public' => true,
        'hierarchical' => true,
        'show_in_rest' => true,
        'rewrite' => ['slug' => 'project-type'],
    ]);

    register_taxonomy('dm_record_type', ['dm_record'], [
        'labels' => ['name' => 'Record Types', 'singular_name' => 'Record Type'],
        'public' => true,
        'hierarchical' => true,
        'show_in_rest' => true,
        'rewrite' => ['slug' => 'record-type'],
    ]);

    $meta = [
        'dm_event_date'      => ['dm_record'],
        'dm_source_url'      => ['dm_record'],
        'dm_project_url'     => ['dm_project'],
        'dm_project_status'  => ['dm_project'],
        'dm_release_url'     => ['dm_release'],
        'dm_media_url'       => ['dm_appearance'],
    ];

    foreach ($meta as $key => $postTypes) {
        foreach ($postTypes as $postType) {
            register_post_meta($postType, $key, [
                'type'              => 'string',
                'single'            => true,
                'show_in_rest'      => true,
                'sanitize_callback' => 'sanitize_text_field',
            ]);
        }
    }
});

function dm_create_leads_table(): void
{
    global $wpdb;
    $table = dm_leads_table();
    $charset = $wpdb->get_charset_collate();

    require_once ABSPATH . 'wp-admin/includes/upgrade.php';
    dbDelta("CREATE TABLE {$table} (
        id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
        email varchar(190) NOT NULL,
        name varchar(190) NOT NULL DEFAULT '',
        source varchar(190) NOT NULL DEFAULT 'donmatthews.live',
        consent tinyint(1) unsigned NOT NULL DEFAULT 1,
        created_at datetime NOT NULL,
        PRIMARY KEY  (id),
        KEY email (email),
        KEY source (source),
        KEY created_at (created_at)
    ) {$charset};");
}

register_activation_hook(__FILE__, static function (): void {
    dm_create_leads_table();
    do_action('init');
    flush_rewrite_rules();
});

register_deactivation_hook(__FILE__, 'flush_rewrite_rules');

add_action('rest_api_init', static function (): void {
    register_rest_route('don-matthews/v1', '/leads', [
        'methods'             => 'POST',
        'permission_callback' => '__return_true',
        'callback'            => static function (WP_REST_Request $request): WP_REST_Response {
            global $wpdb;

            $email = sanitize_email((string) $request->get_param('email'));
            $name = sanitize_text_field((string) $request->get_param('name'));
            $source = sanitize_key((string) $request->get_param('source')) ?: 'website';
            $honeypot = trim((string) $request->get_param('company'));

            if ($honeypot !== '') {
                return new WP_REST_Response(['success' => true], 201);
            }

            if (! is_email($email)) {
                return new WP_REST_Response(['success' => false, 'error' => 'Please enter a valid email address.'], 400);
            }

            $inserted = $wpdb->insert(
                dm_leads_table(),
                [
                    'email'      => $email,
                    'name'       => mb_substr($name, 0, 190),
                    'source'     => mb_substr($source, 0, 190),
                    'consent'    => 1,
                    'created_at' => current_time('mysql', true),
                ],
                ['%s', '%s', '%s', '%d', '%s']
            );

            if ($inserted === false) {
                error_log('[don-matthews-core] Lead insert failed: ' . $wpdb->last_error);
                return new WP_REST_Response(['success' => false, 'error' => 'Unable to save your signup right now.'], 500);
            }

            $leadId = (int) $wpdb->insert_id;

            // Notification is intentionally secondary. The database insert above is the record of truth.
            $adminEmail = get_option('admin_email');
            if (is_email($adminEmail)) {
                wp_mail(
                    $adminEmail,
                    'New donmatthews.live lead',
                    sprintf("Lead #%d\nEmail: %s\nName: %s\nSource: %s", $leadId, $email, $name ?: '(not provided)', $source)
                );
            }

            return new WP_REST_Response(['success' => true, 'leadId' => $leadId], 201);
        },
        'args' => [
            'email' => ['required' => true, 'type' => 'string'],
            'name' => ['required' => false, 'type' => 'string'],
            'source' => ['required' => false, 'type' => 'string'],
            'company' => ['required' => false, 'type' => 'string'],
        ],
    ]);
});

add_shortcode('dm_lead_form', static function (array $atts = []): string {
    $atts = shortcode_atts(['source' => 'website'], $atts, 'dm_lead_form');
    $source = sanitize_key((string) $atts['source']);
    $id = 'dm-lead-' . wp_generate_uuid4();
    $endpoint = rest_url('don-matthews/v1/leads');

    ob_start();
    ?>
    <form id="<?php echo esc_attr($id); ?>" class="dm-lead-form" novalidate>
        <div style="display:grid;gap:.75rem;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));align-items:end;">
            <label>Name <input name="name" type="text" autocomplete="name" placeholder="Your name"></label>
            <label>Email <input name="email" type="email" autocomplete="email" required placeholder="you@example.com"></label>
            <label aria-hidden="true" style="position:absolute;left:-9999px">Company <input name="company" type="text" tabindex="-1" autocomplete="off"></label>
            <button type="submit">Keep Me Updated</button>
        </div>
        <p data-status aria-live="polite" style="margin-top:.75rem"></p>
    </form>
    <script>
    (() => {
        const form = document.getElementById(<?php echo wp_json_encode($id); ?>);
        if (!form) return;
        const status = form.querySelector('[data-status]');
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            status.textContent = 'Saving…';
            const data = new FormData(form);
            data.append('source', <?php echo wp_json_encode($source); ?>);
            try {
                const response = await fetch(<?php echo wp_json_encode($endpoint); ?>, { method: 'POST', body: data });
                const result = await response.json();
                if (!response.ok || !result.success) throw new Error(result.error || 'Unable to save signup.');
                form.reset();
                status.textContent = 'You’re in. Your signup has been saved.';
            } catch (error) {
                status.textContent = error instanceof Error ? error.message : 'Unable to save signup.';
            }
        });
    })();
    </script>
    <?php
    return (string) ob_get_clean();
});

add_action('admin_menu', static function (): void {
    add_management_page(
        'Don Matthews Leads',
        'Don Matthews Leads',
        'manage_options',
        'don-matthews-leads',
        static function (): void {
            global $wpdb;
            $table = dm_leads_table();
            $leads = $wpdb->get_results("SELECT id,email,name,source,created_at FROM {$table} ORDER BY id DESC LIMIT 500", ARRAY_A);
            $exportUrl = wp_nonce_url(admin_url('admin-post.php?action=dm_export_leads'), 'dm_export_leads');
            echo '<div class="wrap"><h1>Don Matthews Leads</h1>';
            echo '<p><a class="button button-primary" href="' . esc_url($exportUrl) . '">Export all leads as CSV</a></p>';
            echo '<table class="widefat striped"><thead><tr><th>ID</th><th>Email</th><th>Name</th><th>Source</th><th>Created (UTC)</th></tr></thead><tbody>';
            foreach ($leads as $lead) {
                echo '<tr><td>' . esc_html((string) $lead['id']) . '</td><td>' . esc_html($lead['email']) . '</td><td>' . esc_html($lead['name']) . '</td><td>' . esc_html($lead['source']) . '</td><td>' . esc_html($lead['created_at']) . '</td></tr>';
            }
            echo '</tbody></table></div>';
        }
    );
});

add_action('admin_post_dm_export_leads', static function (): void {
    if (! current_user_can('manage_options')) {
        wp_die('Unauthorized');
    }
    check_admin_referer('dm_export_leads');

    global $wpdb;
    $table = dm_leads_table();
    $rows = $wpdb->get_results("SELECT id,email,name,source,consent,created_at FROM {$table} ORDER BY id ASC", ARRAY_A);

    nocache_headers();
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename=donmatthews-leads-' . gmdate('Y-m-d') . '.csv');
    $out = fopen('php://output', 'w');
    fputcsv($out, ['id', 'email', 'name', 'source', 'consent', 'created_at_utc']);
    foreach ($rows as $row) {
        fputcsv($out, $row);
    }
    fclose($out);
    exit;
});
