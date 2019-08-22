#!/usr/bin/env node
const { readFile, writeFile, existsSync } = require('fs');
const { join } = require('path');

if (!process.argv[2] || !process.argv[3]) {
  console.log('Usage: translate-drawio lang xml')
  console.log('Example: translate-drawio cn.json ./react-developer-roadmap.xml > ./react-developer-roadmap-cn.xml');
  process.exit(1);
}

const lang = process.argv[2].toLowerCase();
const path = process.argv[3]

if (!existsSync(lang)) {
  console.error('Make sure that file with translation exists')
  process.exit(1);
}

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

readFile(path, 'utf-8', (error, xmlData) => {
  if (!error) {
    readFile(lang, 'utf-8', (error, translationsFile) => {
      if (!error) {
        const translations = JSON.parse(translationsFile);

        let translatedXML = xmlData;
        Object.keys(translations).forEach(key =>
          translatedXML = translatedXML.replace(
            new RegExp(escapeRegExp(`value=\"${key}\"`), 'g'),
            `value="${translations[key]}"`
          )
        );
        console.log(translatedXML)
      }
    });
  }
});
