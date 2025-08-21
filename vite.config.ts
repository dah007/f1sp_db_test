import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

// https://vite.dev/config/
export default defineConfig({
    base: '/',
    plugins: [
        react(),
        tailwindcss(),
        tsconfigPaths(),
        visualizer({
            filename: 'build/stats.html',
            open: false,
            gzipSize: true,
        }),
    ],
    build: {
        outDir: 'build',
        // Add optimization settings
        chunkSizeWarningLimit: 1000, // Increase warning threshold
        cssCodeSplit: true,
        reportCompressedSize: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom', 'react-router-dom', '@reduxjs/toolkit', 'react-redux'],
                    // Split large UI libraries
                    ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-navigation-menu'],
                    // Split mapbox separately as it's typically large
                    maps: ['mapbox-gl'],
                },
            },
        },
        // Enable minification
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            app: '/src/app',
            assets: '/src/assets',
            components: '/src/components',
            constants: '/src/constants',
            features: '/src/features',
            hooks: '/src/hooks',
            routes: '/src/routes',
            selectors: '/src/selectors',
            services: 'services',
            slices: '/src/slices',
            styles: '/src/styles',
            types: '/src/types',
            utils: '/src/utils',
        },
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:4280',
                changeOrigin: true,
            },
            '/data-api': {
                target: 'http://localhost:4280',
                changeOrigin: true,
            },
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./test/setup.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
        },
        deps: {
            optimizer: {
                web: {
                    include: ['react', 'react-dom', '@testing-library/react', '@reduxjs/toolkit', 'react-redux'],
                },
            },
        },
    },
});
