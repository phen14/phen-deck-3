import typescriptEslint from "@typescript-eslint/eslint-plugin";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default [
    {
        ignores: [
            "**/logs",
            "**/*.log",
            "**/pids",
            "**/*.pid",
            "**/*.seed",
            "**/coverage",
            "**/.eslintcache",
            "**/node_modules",
            "**/.DS_Store",
            "release/app/dist",
            "release/build",
            ".erb/dll",
            "**/.idea",
            "**/npm-debug.log.*",
            "**/*.css.d.ts",
            "**/*.sass.d.ts",
            "**/*.scss.d.ts",
            "!**/.erb",
        ],
    },
    ...compat.extends("erb"),
    {
        plugins: {
            "@typescript-eslint": typescriptEslint,
        },

        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
        },

        settings: {
            "import/resolver": {
                node: {
                    extensions: [".js", ".jsx", ".ts", ".tsx"],
                    moduleDirectory: ["node_modules", "src/"],
                },

                webpack: {
                    config: "K:\\src\\phen-deck-3\\.erb\\configs\\webpack.config.eslint.ts",
                },

                typescript: {},
            },

            "import/parsers": {
                "@typescript-eslint/parser": [".ts", ".tsx"],
            },
        },

        rules: {
            "import/no-extraneous-dependencies": "off",
            "react/react-in-jsx-scope": "off",
            "react/jsx-filename-extension": "off",
            "import/extensions": "off",
            "import/no-unresolved": "off",
            "import/no-import-module-exports": "off",
            "no-shadow": "off",
            "@typescript-eslint/no-shadow": "error",
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": "error",
        },
    },
];
