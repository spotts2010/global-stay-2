// lint-staged.config.js
export default {
  '**/*.{js,mjs,cjs}': ['eslint --fix', 'prettier --write'],
  '**/*.{json,md,css}': ['prettier --write'],
};
