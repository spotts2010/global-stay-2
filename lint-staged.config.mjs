// lint-staged.config.mjs
export default {
  '**/*.{js,mjs,cjs}': (files) => [
    `eslint --fix ${files.join(' ')}`,
    `prettier --write ${files.join(' ')}`,
  ],
  '**/*.{json,md,css}': (files) => [`prettier --write ${files.join(' ')}`],
};
