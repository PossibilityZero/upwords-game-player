import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },
  {
    extends: ['plugin:vitest-globals/recommended'],
    env: {
      'vitest-globals/env': true,
    },
  },
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  skipFormatting,
]
