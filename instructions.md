# Workspace Setup Instructions (shadcn CLI, TypeScript, Tailwind)

This document provides instructions on why and how to configure shadcn UI, TypeScript, and Tailwind CSS for this project.

## 1. Why a Dedicated `/components/ui` Folder is Important
The `/components/ui` directory is the standard location for base, reusable UI primitives (like buttons, dialogs, inputs) managed by toolings like **shadcn/ui**. 
- **Modularity:** It separates core layout and business components (e.g. `Navbar`, `Footer`, `Sidebar`) from small visual primitives.
- **CLI Compatibility:** The shadcn CLI automatically places newly added components into `components/ui/` by default.
- **Consistency:** It aligns the workspace with industry-standard patterns, making onboarding easier and codebase maintenance predictable.

---

## 2. Setting Up shadcn UI
To configure and initialize shadcn UI in your React + Vite project:

1. **Initialize the shadcn CLI:**
   Run the initialization command:
   ```bash
   npx shadcn@latest init
   ```
2. **Configuration Prompt Options:**
   Select the options when prompted:
   - **Style:** Default
   - **Base color:** Slate (or your preferred theme)
   - **CSS variables:** Yes
   - **Paths config:** Set components alias to `@/components` and utils alias to `@/lib/utils`.

This will create a `components.json` configuration file in your project root.

---

## 3. Adding TypeScript Support
To convert this React project to TypeScript:

1. **Install TypeScript dependencies:**
   ```bash
   npm install -D typescript @types/react @types/react-dom @vitejs/plugin-react-swc
   ```
2. **Initialize tsconfig:**
   Create a `tsconfig.json` at the root of `frontend/`:
   ```json
   {
     "compilerOptions": {
       "target": "ES2020",
       "useDefineForClassFields": true,
       "lib": ["DOM", "DOM.Iterable", "ES2020"],
       "module": "ESNext",
       "skipLibCheck": true,

       /* Bundler mode */
       "moduleResolution": "bundler",
       "allowImportingTsExtensions": true,
       "resolveJsonModule": true,
       "isolatedModules": true,
       "noEmit": true,
       "jsx": "react-jsx",

       /* Linting */
       "strict": true,
       "noUnusedLocals": true,
       "noUnusedParameters": true,
       "noFallthroughCasesInSwitch": true,

       /* Path Aliases */
       "baseUrl": ".",
       "paths": {
         "@/*": ["./src/*"]
       }
     },
     "include": ["src"],
     "references": [{ "path": "./tsconfig.node.json" }]
   }
   ```
3. **Configure Path Alias in `vite.config.js`:**
   Install `@types/node` to resolve paths properly:
   ```bash
   npm install -D @types/node
   ```
   Then modify your `vite.config.js`:
   ```javascript
   import path from "path"
   import react from "@vitejs/plugin-react"
   import { defineConfig } from "vite"

   export default defineConfig({
     plugins: [react()],
     resolve: {
       alias: {
         "@": path.resolve(__dirname, "./src"),
       },
     },
   })
   ```

---

## 4. Configuring Tailwind CSS 4 or 3
If you want to migrate to Tailwind 4, install the modern Tailwind dependencies:
```bash
npm install tailwindcss @tailwindcss/vite
```
Then, update your main `index.css`:
```css
@import "tailwindcss";
```
If you stay on Tailwind 3 (which is currently active in this project), you can configure animations and custom values inside `tailwind.config.js` under the `extend` object.
