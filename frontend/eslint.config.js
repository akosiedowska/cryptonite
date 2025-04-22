// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended')
const unusedImports = require("eslint-plugin-unused-imports")

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: require("@typescript-eslint/parser"),
      sourceType: "module",
    },
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    plugins: {
      "unused-imports": unusedImports
    },
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
      "no-console": "error",
      // "no-unused-vars": ["error"],
      "no-unused-labels": "error",
      "no-unused-expressions": "error",
      "unused-imports/no-unused-imports": "error",
      "@typescript-eslint/no-unused-vars": "error",
      // "unused-imports/no-unused-vars": [
      //   "error",
      //   {
      //     "vars": "all",
      //     "varsIgnorePattern": "^_",
      //     "args": "after-used",
      //     "argsIgnorePattern": "^_"
      //   },
      // ],
      "@typescript-eslint/no-unused-expressions": "error"
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
      eslintPluginPrettierRecommended
    ],
    rules: {
      "prettier/prettier": "error"
    },
  }
);
