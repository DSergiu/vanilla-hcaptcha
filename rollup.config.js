import { terser } from "rollup-plugin-terser";

export default {
    input: './src/hcaptcha.js',
    output: {
        file: './dist/hcaptcha-component.min.js',
        format: 'iife',
        name: 'bundle'
    },
    plugins: [
        terser()
    ]
};
