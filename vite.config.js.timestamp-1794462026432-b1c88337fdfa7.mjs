// vite.config.js
import { defineConfig } from "file:///sessions/vibrant-dreamy-wozniak/mnt/sprint-smu/node_modules/vite/dist/node/index.js";
import react from "file:///sessions/vibrant-dreamy-wozniak/mnt/sprint-smu/node_modules/@vitejs/plugin-react/dist/index.js";
import { VitePWA } from "file:///sessions/vibrant-dreamy-wozniak/mnt/sprint-smu/node_modules/vite-plugin-pwa/dist/index.js";
var vite_config_default = defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true
      }
    }
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["pwa-192.png", "pwa-512.png"],
      manifest: {
        name: "Sprint SMU",
        short_name: "Sprint",
        lang: "id",
        start_url: "/",
        display: "standalone",
        background_color: "#0B1224",
        theme_color: "#0B1224",
        icons: [
          { src: "pwa-192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512.png", sizes: "512x512", type: "image/png" },
          { src: "pwa-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
        ]
      },
      // Jangan simpan panggilan AI di cache offline
      workbox: { navigateFallbackDenylist: [/^\/api\//] }
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvc2Vzc2lvbnMvdmlicmFudC1kcmVhbXktd296bmlhay9tbnQvc3ByaW50LXNtdVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL3Nlc3Npb25zL3ZpYnJhbnQtZHJlYW15LXdvem5pYWsvbW50L3NwcmludC1zbXUvdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL3Nlc3Npb25zL3ZpYnJhbnQtZHJlYW15LXdvem5pYWsvbW50L3NwcmludC1zbXUvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuaW1wb3J0IHsgVml0ZVBXQSB9IGZyb20gXCJ2aXRlLXBsdWdpbi1wd2FcIjtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgc2VydmVyOiB7XG4gICAgcHJveHk6IHtcbiAgICAgICcvYXBpJzoge1xuICAgICAgICB0YXJnZXQ6ICdodHRwOi8vbG9jYWxob3N0OjMwMDAnLFxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIFZpdGVQV0Eoe1xuICAgICAgcmVnaXN0ZXJUeXBlOiBcImF1dG9VcGRhdGVcIixcbiAgICAgIGluY2x1ZGVBc3NldHM6IFtcInB3YS0xOTIucG5nXCIsIFwicHdhLTUxMi5wbmdcIl0sXG4gICAgICBtYW5pZmVzdDoge1xuICAgICAgICBuYW1lOiBcIlNwcmludCBTTVVcIixcbiAgICAgICAgc2hvcnRfbmFtZTogXCJTcHJpbnRcIixcbiAgICAgICAgbGFuZzogXCJpZFwiLFxuICAgICAgICBzdGFydF91cmw6IFwiL1wiLFxuICAgICAgICBkaXNwbGF5OiBcInN0YW5kYWxvbmVcIixcbiAgICAgICAgYmFja2dyb3VuZF9jb2xvcjogXCIjMEIxMjI0XCIsXG4gICAgICAgIHRoZW1lX2NvbG9yOiBcIiMwQjEyMjRcIixcbiAgICAgICAgaWNvbnM6IFtcbiAgICAgICAgICB7IHNyYzogXCJwd2EtMTkyLnBuZ1wiLCBzaXplczogXCIxOTJ4MTkyXCIsIHR5cGU6IFwiaW1hZ2UvcG5nXCIgfSxcbiAgICAgICAgICB7IHNyYzogXCJwd2EtNTEyLnBuZ1wiLCBzaXplczogXCI1MTJ4NTEyXCIsIHR5cGU6IFwiaW1hZ2UvcG5nXCIgfSxcbiAgICAgICAgICB7IHNyYzogXCJwd2EtNTEyLnBuZ1wiLCBzaXplczogXCI1MTJ4NTEyXCIsIHR5cGU6IFwiaW1hZ2UvcG5nXCIsIHB1cnBvc2U6IFwibWFza2FibGVcIiB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIC8vIEphbmdhbiBzaW1wYW4gcGFuZ2dpbGFuIEFJIGRpIGNhY2hlIG9mZmxpbmVcbiAgICAgIHdvcmtib3g6IHsgbmF2aWdhdGVGYWxsYmFja0RlbnlsaXN0OiBbL15cXC9hcGlcXC8vXSB9LFxuICAgIH0pLFxuICBdLFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQStULFNBQVMsb0JBQW9CO0FBQzVWLE9BQU8sV0FBVztBQUNsQixTQUFTLGVBQWU7QUFFeEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsUUFBUTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLFFBQ04sUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLE1BQ2hCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLFFBQVE7QUFBQSxNQUNOLGNBQWM7QUFBQSxNQUNkLGVBQWUsQ0FBQyxlQUFlLGFBQWE7QUFBQSxNQUM1QyxVQUFVO0FBQUEsUUFDUixNQUFNO0FBQUEsUUFDTixZQUFZO0FBQUEsUUFDWixNQUFNO0FBQUEsUUFDTixXQUFXO0FBQUEsUUFDWCxTQUFTO0FBQUEsUUFDVCxrQkFBa0I7QUFBQSxRQUNsQixhQUFhO0FBQUEsUUFDYixPQUFPO0FBQUEsVUFDTCxFQUFFLEtBQUssZUFBZSxPQUFPLFdBQVcsTUFBTSxZQUFZO0FBQUEsVUFDMUQsRUFBRSxLQUFLLGVBQWUsT0FBTyxXQUFXLE1BQU0sWUFBWTtBQUFBLFVBQzFELEVBQUUsS0FBSyxlQUFlLE9BQU8sV0FBVyxNQUFNLGFBQWEsU0FBUyxXQUFXO0FBQUEsUUFDakY7QUFBQSxNQUNGO0FBQUE7QUFBQSxNQUVBLFNBQVMsRUFBRSwwQkFBMEIsQ0FBQyxVQUFVLEVBQUU7QUFBQSxJQUNwRCxDQUFDO0FBQUEsRUFDSDtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
