import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    plugins: [
        
    ],
    build: {
        format: 'es',
        outDir: 'dist',
        lib: {
            entry: resolve(__dirname, 'main.js'),
            name: "Diameter",
            type: "module",
            filename: "diameter"
        },
        sourcemap: true,
        target: 'esnext',
        rollupOptions: {
            output: {
                // You can further customize how the file is named
                // For example, if you want to ensure it's myModule.js:
                entryFileNames: 'diameter.js', // Output filename
                chunkFileNames: '[name].js', // Name for any code-split chunks
                assetFileNames: '[name][extname]', // Asset filenames
            }
        }
    }
})