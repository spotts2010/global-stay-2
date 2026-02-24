export default [
  {
    ignores: [
      '**/*.ts',
      '**/*.tsx',
      'node_modules/**',
      '.next/**',
      'playwright-report/**',
      '.eslintcache',
      'firestore-debug.log',
      'public/uploads/**',
    ],
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    rules: {},
  },
];
