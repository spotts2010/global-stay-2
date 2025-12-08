// check-unused-deps.js
// Usage: node check-unused-deps.js

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get top-level dependencies from pnpm
let deps;
try {
  const depsOutput = execSync('npx pnpm list --depth=0 --json', { stdio: ['pipe', 'pipe', 'ignore'] }).toString();
  deps = JSON.parse(depsOutput);
} catch (err) {
  console.error('Failed to get pnpm dependencies. Make sure pnpm is installed.');
  console.error(err.message);
  process.exit(1);
}

// Get dependencies names
const depNames = Object.keys(deps.dependencies || {});

// Scan src for used packages
function getUsedPackages(srcDir) {
  const used = new Set();

  function walk(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
      const fullPath = path.join(dir, file.name);
      if (file.isDirectory()) {
        walk(fullPath);
      } else if (file.isFile() && /\.(js|ts|tsx|jsx)$/.test(file.name)) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        depNames.forEach((dep) => {
          const regex = new RegExp(`require\\(['"\`]${dep}['"\`]\\)|from ['"\`]${dep}['"\`]`);
          if (regex.test(content)) used.add(dep);
        });
      }
    }
  }

  walk(srcDir);
  return Array.from(used);
}

const usedDeps = getUsedPackages(path.join(__dirname, 'src'));

// Compare
const unusedDeps = depNames.filter((dep) => !usedDeps.includes(dep));

console.log('Used dependencies:', usedDeps);
console.log('Unused dependencies:', unusedDeps);
