const unitConfig = {
    collectCoverage : true,
    displayName     : "unit",
    verbose         : true,
    silent          : false,
    moduleDirectories: [
        ".",
        "src",
        "node_modules"
    ],
    testMatch: [
        "<rootDir>/__tests__/unit/**/*.test.js"
    ]
};

export default {
    verbose : true,
    projects: [
        unitConfig
    ]
};
