#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const root = path.resolve(process.cwd());
const translationsFile = path.join(root, 'src', 'components', 'LanguageProvider.tsx');

function readFile(p) {
  return fs.readFileSync(p, 'utf8');
}

function findBetween(content, startIdx) {
  // Find first '{' at or after startIdx
  const start = content.indexOf('{', startIdx);
  if (start === -1) return null;
  let i = start;
  let depth = 0;
  let inStr = null; // '"' or '\''
  let escaped = false;
  let inLineComment = false;
  let inBlockComment = false;
  for (; i < content.length; i++) {
    const ch = content[i];
    const prev = content[i - 1];
    const next = content[i + 1];

    if (inLineComment) {
      if (ch === '\n') inLineComment = false;
      continue;
    }
    if (inBlockComment) {
      if (ch === '*' && next === '/') { inBlockComment = false; i++; }
      continue;
    }

    if (!inStr) {
      if (ch === '/' && next === '/') { inLineComment = true; i++; continue; }
      if (ch === '/' && next === '*') { inBlockComment = true; i++; continue; }
    }

    if (!inStr) {
      if (ch === '"' || ch === '\'') { inStr = ch; escaped = false; continue; }
    } else {
      if (!escaped && ch === '\\') { escaped = true; continue; }
      if (!escaped && ch === inStr) { inStr = null; continue; }
      escaped = false;
      continue;
    }

    if (!inStr) {
      if (ch === '{') depth++;
      else if (ch === '}') {
        depth--;
        if (depth === 0) {
          return { start, end: i };
        }
      }
    }
  }
  return null;
}

function extractLangBlock(translationsContent, langTag) {
  const tagIdx = translationsContent.indexOf(langTag);
  if (tagIdx === -1) return '';
  const range = findBetween(translationsContent, tagIdx);
  if (!range) return '';
  return translationsContent.slice(range.start + 1, range.end); // inside {...}
}

function extractTranslations(content) {
  const translationsIdx = content.indexOf('const translations');
  if (translationsIdx === -1) throw new Error('translations object not found');
  const fullRange = findBetween(content, content.indexOf('=', translationsIdx));
  if (!fullRange) throw new Error('translations block braces not matched');
  const translationsContent = content.slice(fullRange.start + 1, fullRange.end);

  const langs = ['en', 'it', 'fr', 'de'];
  const langBlocks = {};
  for (const lang of langs) {
    const block = extractLangBlock(translationsContent, `\n  ${lang}:`);
    langBlocks[lang] = block || '';
  }

  const keyRegex = /\"([^\"]+)\"\s*:/g;
  const langKeys = {};
  for (const lang of Object.keys(langBlocks)) {
    const keys = new Set();
    const block = langBlocks[lang];
    if (!block) { langKeys[lang] = keys; continue; }
    let m;
    while ((m = keyRegex.exec(block)) !== null) {
      keys.add(m[1]);
    }
    langKeys[lang] = keys;
  }
  return langKeys;
}

function walkDir(dir, fileFilter) {
  const out = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === 'dist' || e.name.startsWith('.')) continue;
      out.push(...walkDir(p, fileFilter));
    } else if (fileFilter(p)) {
      out.push(p);
    }
  }
  return out;
}

function collectUsedKeys() {
  const fileFilter = p => /\.(ts|tsx)$/i.test(p);
  const files = [
    ...walkDir(path.join(root, 'src'), fileFilter),
    ...walkDir(path.join(root, 'pages'), fileFilter),
  ];
  const used = new Set();
  const re = /\bt\(\s*(["'])([^"']+)\1\s*\)/g;
  for (const f of files) {
    const text = fs.readFileSync(f, 'utf8');
    let m;
    while ((m = re.exec(text)) !== null) {
      used.add(m[2]);
    }
  }
  return used;
}

function main() {
  const content = readFile(translationsFile);
  const langKeys = extractTranslations(content);
  const langs = Object.keys(langKeys);

  const union = new Set();
  for (const kset of Object.values(langKeys)) {
    for (const k of kset) union.add(k);
  }

  const report = [];
  for (const lang of langs) {
    const missing = [...union].filter(k => !langKeys[lang].has(k));
    report.push({ lang, total: langKeys[lang].size, missingCount: missing.length, missing });
  }

  const used = collectUsedKeys();
  const missingByLangFromUsed = {};
  for (const lang of langs) missingByLangFromUsed[lang] = [];
  for (const key of used) {
    for (const lang of langs) {
      if (!langKeys[lang].has(key)) missingByLangFromUsed[lang].push(key);
    }
  }

  const summary = {
    totals: Object.fromEntries(langs.map(l => [l, langKeys[l].size])),
    unionCount: union.size,
  };

  console.log('Translation audit summary:\n');
  console.table(summary);

  console.log('\nMissing keys per language (compared to union):');
  for (const r of report) {
    console.log(`\n[${r.lang}] missing ${r.missingCount} of ${summary.unionCount}`);
    if (r.missingCount) {
      console.log(r.missing.sort().join('\n'));
    }
  }

  console.log('\nUsed keys missing per language (only keys referenced in code):');
  for (const lang of langs) {
    const arr = missingByLangFromUsed[lang];
    console.log(`\n[${lang}] used missing ${arr.length}`);
    if (arr.length) console.log([...new Set(arr)].sort().join('\n'));
  }

  // Write JSON report
  const out = {
    summary,
    usedMissingByLang: Object.fromEntries(langs.map(l => [l, [...new Set(missingByLangFromUsed[l])].sort()])),
  };
  const outPath = path.join(root, 'scripts', 'translation-report.json');
  try {
    fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
    console.log(`\nJSON report written to: ${path.relative(root, outPath)}`);
  } catch (e) {
    console.error('Failed to write JSON report:', e);
  }
}

try { main(); } catch (e) {
  console.error('Error during translation audit:', e);
  process.exit(1);
}
