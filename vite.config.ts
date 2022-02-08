import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import visualizer from 'rollup-plugin-visualizer';

const plugins: any[] = [react()];

// if (process.env.NODE_ENV === 'production') {
//     // 打包依赖展示
//     plugins.push(
//         visualizer({
//             open: true,
//             gzipSize: true,
//             brotliSize: true
//         })
//     );
// }

// https://vitejs.dev/config/
export default defineConfig({
    plugins,
    resolve: {
        dedupe: ['react', 'react-dom']
    }
});
