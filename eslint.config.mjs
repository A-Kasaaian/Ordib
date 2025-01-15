import { fixupPluginRules } from "@eslint/compat";
import testingLibrary from "eslint-plugin-testing-library";
import babelParser from "@babel/eslint-parser";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import hooksPlugin from "eslint-plugin-react-hooks";
import globals from "globals";

export default [
  {
    files: ["src/**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    ignores: ["dist/**", "src/store/types.ts"],
    languageOptions: {
      globals: globals.browser,
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 2020,
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      react: react,
      "react-hooks": fixupPluginRules(hooksPlugin),
      "testing-library": testingLibrary,
    },
    rules: {
      "no-unused-vars": "off",
      "no-undef": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
      "react-hooks/exhaustive-deps": "off",
      "react/forbid-component-props": [
        "error",
        {
          forbid: [
            {
              propName: "data-test",
              message: "Use `data-testid` instead of `data-test` attribute",
            },
          ],
        },
      ],
      "react/forbid-dom-props": [
        "error",
        {
          forbid: [
            {
              propName: "data-test",
              message: "Use `data-testid` instead of `data-test` attribute",
            },
          ],
        },
      ],
      "react/display-name": "off",
    },
    settings: {
      react: {
        version: "detect", // Automatically detect the React version
      },
    },
  },
  {
    files: ["**/src/**/*.ts?(x)"],
    ignores: ["**/src/store/types.ts"],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 2018,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    files: ["**/__tests__/**/*.[jt]s?(x)", "**/src/**/?(*.)+(spec|test).[jt]s?(x)"],
    plugins: {
      "testing-library": testingLibrary,
      "@typescript-eslint": tseslint,
      react: react,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 2020,
        sourceType: "module",
      },
    },
    rules: {
      ...testingLibrary.configs["flat/react"].rules,
      "testing-library/no-node-access": "off",
      "testing-library/no-container": "off",
      "testing-library/no-render-in-lifecycle": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        }
      ]
    }
  }
];