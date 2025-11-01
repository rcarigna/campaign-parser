#!/usr/bin/env node

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const THRESHOLDS = {
  small: 50,
  medium: 100,
  large: 150,
  xlarge: 200,
};

const COLORS = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  orange: '\x1b[35m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

function getComponentFiles(dir) {
  const files = [];

  function traverse(currentDir) {
    const items = readdirSync(currentDir);

    for (const item of items) {
      const fullPath = join(currentDir, item);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (extname(item) === '.tsx' && !item.includes('.test.')) {
        files.push(fullPath);
      }
    }
  }

  traverse(dir);
  return files;
}

function analyzeFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  // Filter out empty lines and comments
  const codeLines = lines.filter((line) => {
    const trimmed = line.trim();
    return (
      trimmed !== '' &&
      !trimmed.startsWith('//') &&
      !trimmed.startsWith('/*') &&
      !trimmed.startsWith('*') &&
      trimmed !== '*/'
    );
  });

  const totalLines = lines.length;
  const codeOnlyLines = codeLines.length;

  // Count JSX return statements (rough complexity metric)
  const jsxBlocks = content.match(/return\s*\(/g)?.length || 0;

  // Count function/component definitions
  const functions =
    content.match(/(function|const\s+\w+\s*=|export\s+const\s+\w+\s*=)/g)
      ?.length || 0;

  // Count useState/useEffect hooks
  const hooks =
    content.match(/use(State|Effect|Callback|Memo|Ref)/g)?.length || 0;

  return {
    filePath,
    totalLines,
    codeOnlyLines,
    jsxBlocks,
    functions,
    hooks,
  };
}

function getColorForSize(lines) {
  if (lines <= THRESHOLDS.small) return COLORS.green;
  if (lines <= THRESHOLDS.medium) return COLORS.yellow;
  if (lines <= THRESHOLDS.large) return COLORS.orange;
  return COLORS.red;
}

function getSizeCategory(lines) {
  if (lines <= THRESHOLDS.small) return 'Small';
  if (lines <= THRESHOLDS.medium) return 'Medium';
  if (lines <= THRESHOLDS.large) return 'Large';
  return 'X-Large';
}

function main() {
  const clientDir = join(__dirname, '../client/src/components');
  const componentFiles = getComponentFiles(clientDir);

  console.log(`${COLORS.bold}🔍 Component Size Analysis${COLORS.reset}\n`);

  const analyses = componentFiles
    .map(analyzeFile)
    .sort((a, b) => b.totalLines - a.totalLines);

  // Summary stats
  const totalComponents = analyses.length;
  const avgLines = Math.round(
    analyses.reduce((sum, a) => sum + a.totalLines, 0) / totalComponents
  );
  const largeComponents = analyses.filter(
    (a) => a.totalLines > THRESHOLDS.large
  ).length;

  console.log(`📊 ${COLORS.bold}Summary:${COLORS.reset}`);
  console.log(`   Total Components: ${totalComponents}`);
  console.log(`   Average Lines: ${avgLines}`);
  console.log(
    `   Large Components (>${THRESHOLDS.large} lines): ${largeComponents}`
  );
  console.log('');

  // Detailed breakdown
  console.log(`📋 ${COLORS.bold}Component Breakdown:${COLORS.reset}\n`);

  analyses.forEach((analysis, index) => {
    const relativePath = analysis.filePath
      .replace(clientDir, '')
      .replace(/\\/g, '/');
    const color = getColorForSize(analysis.totalLines);
    const category = getSizeCategory(analysis.totalLines);

    console.log(
      `${color}${analysis.totalLines.toString().padStart(3)} lines${
        COLORS.reset
      } │ ${category.padEnd(8)} │ ${relativePath}`
    );

    if (analysis.totalLines > THRESHOLDS.large) {
      console.log(
        `${COLORS.yellow}          │          │ └─ 🚨 Consider refactoring (${analysis.hooks} hooks, ${analysis.functions} functions)${COLORS.reset}`
      );
    }
  });

  // Warnings
  console.log('\n');
  const warnings = analyses.filter((a) => a.totalLines > THRESHOLDS.large);
  if (warnings.length > 0) {
    console.log(`${COLORS.red}⚠️  Large Components Detected:${COLORS.reset}`);
    warnings.forEach((w) => {
      const relativePath = w.filePath
        .replace(clientDir, '')
        .replace(/\\/g, '/');
      console.log(`   • ${relativePath} (${w.totalLines} lines)`);
    });

    console.log(`\n${COLORS.yellow}💡 Suggestions:${COLORS.reset}`);
    console.log('   • Extract custom hooks for complex state logic');
    console.log('   • Break down into smaller sub-components');
    console.log('   • Move utility functions to separate files');
    console.log('   • Consider using composition patterns');
  } else {
    console.log(
      `${COLORS.green}✅ All components are within recommended size limits!${COLORS.reset}`
    );
  }

  // Exit with error code if there are violations
  process.exit(warnings.length > 0 ? 1 : 0);
}

main();
