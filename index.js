#!/usr/bin/env node
const { readFile, writeFile, existsSync } = require('fs');
const { join } = require('path');

if (!process.argv[2] || !process.argv[3]) {
  console.error('Please provide language or draw.io xml for translation')
  console.log('Usage: node ./translate.js lang xml')
  console.log('Example: node ./translate.js cn ./react-developer-roadmap.xml');
  process.exit(1);
}

const lang = process.argv[2].toLowerCase();
const path = process.argv[3]

if (!existsSync(join(__dirname, `./${lang}.json`))) {
  console.error('Make sure that file with translation exists')
  process.exit(1);
}

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

readFile(path, 'utf-8', (error, xmlData) => {
  if (!error) {
    readFile(join(__dirname, `./${lang}.json`), 'utf-8', (error, translationsFile) => {
      if (!error) {
        const translations = JSON.parse(translationsFile);

        let translatedXML = xmlData;
        Object.keys(translations).forEach(key =>
          translatedXML = translatedXML.replace(
            new RegExp(escapeRegExp(`value=\"${key}\"`), 'g'),
            `value="${translations[key]}"`
          )
        );
        writeFile(`${path}-${lang}.xml`, translatedXML, 'utf-8', error => {
          if (!error) {
            console.log(`Translated to ${lang}`);
          }
        });
      }
    });
  }
});
