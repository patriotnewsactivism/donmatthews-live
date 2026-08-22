<?php
/**
 * Plugin Name: Don Matthews Core
 * Description: Structured content model for projects, public-record timeline entries, music releases, and media appearances on donmatthews.live.
 * Version: 0.1.0
 * Author: Don Matthews
 * Text Domain: don-matthews-core
 */

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
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
        'dm_event_date'   => ['dm_record'],
        'dm_source_url'   => ['dm_record'],
        'dm_project_url'  => ['dm_project'],
        'dm_project_status' => ['dm_project'],
        'dm_release_url'  => ['dm_release'],
        'dm_media_url'    => ['dm_appearance'],
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

register_activation_hook(__FILE__, static function (): void {
    do_action('init');
    flush_rewrite_rules();
});

register_deactivation_hook(__FILE__, 'flush_rewrite_rules');
