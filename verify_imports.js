const fs = require('fs');
const path = require('path');

// Check App.tsx for unused imports
const appCode = fs.readFileSync('/c/Users/JOY/africa-map/src/App.tsx', 'utf8');

console.log('=== App.tsx imports ===');
const importLines = appCode.split('\n').filter(line => line.includes('import'));
importLines.forEach(line => console.log(line));

console.log('\n=== Checking mapRef usage in App.tsx ===');
if (appCode.includes('mapRef')) {
  const count = (appCode.match(/mapRef/g) || []).length;
  console.log(`mapRef appears ${count} times`);
  const lines = appCode.split('\n').filter((line, idx) => line.includes('mapRef') && console.log(`  Line ${idx+1}: ${line.trim()}`));
}

console.log('\n=== Checking useRef usage in App.tsx ===');
if (appCode.includes('useRef')) {
  console.log('useRef is imported and used');
} else {
  console.log('useRef is NOT used');
}
