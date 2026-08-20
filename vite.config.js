import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

const root = import.meta.dirname;

// Every .html file below becomes its own reachable page in `npm run dev`
// AND gets bundled if someone runs `npm run build`. Students mostly only
// ever need `npm run dev` and to click around in the browser sidebar/URL bar.
export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, "index.html"),
        login: resolve(root, "login.html"),
        sidebar: resolve(root, "components/sidebar.html"),
        topbar: resolve(root, "components/topbar.html"),
        statCards: resolve(root, "components/stat-cards.html"),
        bookTable: resolve(root, "components/book-table.html"),
        activity: resolve(root, "components/activity.html"),
        loginCard: resolve(root, "components/login-card.html"),
      },
    },
  },
});
