// vite.config.js
import { defineConfig } from "file:///sessions/compassionate-relaxed-lovelace/mnt/sprint-smu/node_modules/vite/dist/node/index.js";
import react from "file:///sessions/compassionate-relaxed-lovelace/mnt/sprint-smu/node_modules/@vitejs/plugin-react/dist/index.js";
import { VitePWA } from "vite-plugin-pwa";
var vite_config_default = defineConfig({
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvc2Vzc2lvbnMvY29tcGFzc2lvbmF0ZS1yZWxheGVkLWxvdmVsYWNlL21udC9zcHJpbnQtc211XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvc2Vzc2lvbnMvY29tcGFzc2lvbmF0ZS1yZWxheGVkLWxvdmVsYWNlL21udC9zcHJpbnQtc211L3ZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9zZXNzaW9ucy9jb21wYXNzaW9uYXRlLXJlbGF4ZWQtbG92ZWxhY2UvbW50L3NwcmludC1zbXUvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuaW1wb3J0IHsgVml0ZVBXQSB9IGZyb20gXCJ2aXRlLXBsdWdpbi1wd2FcIjtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgVml0ZVBXQSh7XG4gICAgICByZWdpc3RlclR5cGU6IFwiYXV0b1VwZGF0ZVwiLFxuICAgICAgaW5jbHVkZUFzc2V0czogW1wicHdhLTE5Mi5wbmdcIiwgXCJwd2EtNTEyLnBuZ1wiXSxcbiAgICAgIG1hbmlmZXN0OiB7XG4gICAgICAgIG5hbWU6IFwiU3ByaW50IFNNVVwiLFxuICAgICAgICBzaG9ydF9uYW1lOiBcIlNwcmludFwiLFxuICAgICAgICBsYW5nOiBcImlkXCIsXG4gICAgICAgIHN0YXJ0X3VybDogXCIvXCIsXG4gICAgICAgIGRpc3BsYXk6IFwic3RhbmRhbG9uZVwiLFxuICAgICAgICBiYWNrZ3JvdW5kX2NvbG9yOiBcIiMwQjEyMjRcIixcbiAgICAgICAgdGhlbWVfY29sb3I6IFwiIzBCMTIyNFwiLFxuICAgICAgICBpY29uczogW1xuICAgICAgICAgIHsgc3JjOiBcInB3YS0xOTIucG5nXCIsIHNpemVzOiBcIjE5MngxOTJcIiwgdHlwZTogXCJpbWFnZS9wbmdcIiB9LFxuICAgICAgICAgIHsgc3JjOiBcInB3YS01MTIucG5nXCIsIHNpemVzOiBcIjUxMng1MTJcIiwgdHlwZTogXCJpbWFnZS9wbmdcIiB9LFxuICAgICAgICAgIHsgc3JjOiBcInB3YS01MTIucG5nXCIsIHNpemVzOiBcIjUxMng1MTJcIiwgdHlwZTogXCJpbWFnZS9wbmdcIiwgcHVycG9zZTogXCJtYXNrYWJsZVwiIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgLy8gSmFuZ2FuIHNpbXBhbiBwYW5nZ2lsYW4gQUkgZGkgY2FjaGUgb2ZmbGluZVxuICAgICAgd29ya2JveDogeyBuYXZpZ2F0ZUZhbGxiYWNrRGVueWxpc3Q6IFsvXlxcL2FwaVxcLy9dIH0sXG4gICAgfSksXG4gIF0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBdVYsU0FBUyxvQkFBb0I7QUFDcFgsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsZUFBZTtBQUV4QixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixRQUFRO0FBQUEsTUFDTixjQUFjO0FBQUEsTUFDZCxlQUFlLENBQUMsZUFBZSxhQUFhO0FBQUEsTUFDNUMsVUFBVTtBQUFBLFFBQ1IsTUFBTTtBQUFBLFFBQ04sWUFBWTtBQUFBLFFBQ1osTUFBTTtBQUFBLFFBQ04sV0FBVztBQUFBLFFBQ1gsU0FBUztBQUFBLFFBQ1Qsa0JBQWtCO0FBQUEsUUFDbEIsYUFBYTtBQUFBLFFBQ2IsT0FBTztBQUFBLFVBQ0wsRUFBRSxLQUFLLGVBQWUsT0FBTyxXQUFXLE1BQU0sWUFBWTtBQUFBLFVBQzFELEVBQUUsS0FBSyxlQUFlLE9BQU8sV0FBVyxNQUFNLFlBQVk7QUFBQSxVQUMxRCxFQUFFLEtBQUssZUFBZSxPQUFPLFdBQVcsTUFBTSxhQUFhLFNBQVMsV0FBVztBQUFBLFFBQ2pGO0FBQUEsTUFDRjtBQUFBO0FBQUEsTUFFQSxTQUFTLEVBQUUsMEJBQTBCLENBQUMsVUFBVSxFQUFFO0FBQUEsSUFDcEQsQ0FBQztBQUFBLEVBQ0g7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
