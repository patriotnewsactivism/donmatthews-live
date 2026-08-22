<?php
/**
 * Don Matthews Flagship theme bootstrap.
 */

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

add_action('wp_enqueue_scripts', static function (): void {
    wp_enqueue_style(
        'don-matthews-style',
        get_stylesheet_uri(),
        [],
        wp_get_theme()->get('Version')
    );
});

add_action('after_setup_theme', static function (): void {
    add_theme_support('post-thumbnails');
    add_theme_support('responsive-embeds');
    add_theme_support('editor-styles');
});
