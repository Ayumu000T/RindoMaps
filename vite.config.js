import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import path from 'path';


export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/css/styles.css',
                'resources/js/app.js',
                'resources/js/main.js',
                'resources/js/contact/contact_page.js',
            ],
            refresh: false,
        }),
    ],
    resolve: {
        alias: {
            'swiper': path.resolve(__dirname, 'node_modules/swiper/swiper-bundle.min.js'),
            'swiper/css': path.resolve(__dirname, 'node_modules/swiper/swiper-bundle.min.css'),
        },
    },
    publicDir: 'static',
    build: {
        outDir: 'public/build',
        emptyOutDir: true,
    },
});

