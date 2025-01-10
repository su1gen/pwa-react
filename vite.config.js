import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'logo192.png', 'logo512.png'],
            manifest: {
                short_name: "Share PWA",
                name: "Share PWA Example",
                icons: [
                    {
                        src: "favicon.ico",
                        sizes: "64x64 32x32 24x24 16x16",
                        type: "image/x-icon"
                    },
                    {
                        src: "logo192.png",
                        type: "image/png",
                        sizes: "192x192",
                        purpose: "any maskable"
                    },
                    {
                        src: "logo512.png",
                        type: "image/png",
                        sizes: "512x512",
                        purpose: "any maskable"
                    }
                ],
                start_url: "/",
                scope: "/",
                display: "standalone",
                theme_color: "#000000",
                background_color: "#ffffff",
                share_target: {
                    action: "/share-target",
                    method: "POST",
                    enctype: "multipart/form-data",
                    params: {
                        files: [
                            {
                                name: "media",
                                accept: ["image/*", "*/*"]
                            }
                        ]
                    }
                },
                file_handlers: [
                    {
                        action: "/open-file",
                        accept: {
                            "image/*": [".jpg", ".jpeg", ".png", ".gif"],
                            "application/pdf": [".pdf"],
                            "*/*": [".*"]
                        }
                    }
                ],
                categories: ["utilities", "productivity"],
                prefer_related_applications: false
            },
            workbox: {
                runtimeCaching: [{
                        urlPattern: /^https:\/\/api\.*/i,
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'api-cache',
                            networkTimeoutSeconds: 10,
                            expiration: {
                                maxEntries: 50,
                                maxAgeSeconds: 24 * 60 * 60 // 24 hours
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    }]
            }
        })
    ],
});
