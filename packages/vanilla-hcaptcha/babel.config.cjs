module.exports = {
    env: {
        test: {
            presets: [
                "@babel/preset-env"
            ],
            plugins: [
                "@babel/plugin-syntax-dynamic-import"
            ]
        }
    }
};
