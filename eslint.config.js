import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // eve/ é o protótipo Angular, mantido só como referência para o porte.
  { ignores: ["eve/", "build/", ".react-router/", "node_modules/"] },
  js.configs.recommended,
  tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  jsxA11y.flatConfigs.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
  // Desliga as regras de estilo que o Prettier já cuida; precisa ser o último.
  prettier,
);
