// lint-staged.config.mjs
const config = {
  '**/*.{js,mjs,cjs,ts,tsx}': (files) => [
    `eslint --max-warnings=0 --fix --cache ${files.join(' ')}`,
    `prettier --write ${files.join(' ')}`,
  ],
  '**/*.{json,md,css,scss}': (files) => [`prettier --write ${files.join(' ')}`],
};

export default config;
