import prettier from 'prettier';

export const languages = [
  {
    name: 'templ',
    parsers: ['templ'],
    extensions: ['.templ'],
  },
];

export const parsers = {
  templ: {
    parse: (text) => ({ text }),
    astFormat: 'templ',
    locStart: () => 0,
    locEnd: (node) => node.text.length,
  },
};

export const printers = {
  templ: {
    print: async (path, options) => {
      const { text } = path.getValue();
      const scriptRegex = /^(\s*)<script([\s\S]*?)>(\n([\s\S]*?))?<\/script>/gm;
      const classAttrRegex =
        /class="[^"\\]*(?:\\.[^"\\]*)*"|class='[^'\\]*(?:\\.[^'\\]*)*'/g;
      let transformedText = text;
      const singleIndent = options.useTabs
        ? '\t'
        : ' '.repeat(options.tabWidth);

      try {
        const scriptMatches = transformedText.matchAll(scriptRegex);

        for (const [
          match,
          leadingWhitespace,
          scriptAttributes,
          _,
          scriptContent,
        ] of scriptMatches) {
          if (!scriptContent?.trim()) {
            continue;
          }

          const formattedScript = await prettier.format(scriptContent.trim(), {
            ...options,
            parser: 'acorn',
          });
          const indentedScript = formattedScript
            .trim()
            .split('\n')
            .map((line) => `${leadingWhitespace}${singleIndent}${line}`)
            .join('\n');
          const replacementScript = `${leadingWhitespace}<script${scriptAttributes}>\n${indentedScript}\n${leadingWhitespace}</script>`;
          transformedText = transformedText.replace(match, replacementScript);
        }
      } catch (err) {
        console.error(
          `Error formatting script content within .templ file: ${err.message}`,
        );

        if (err.loc) {
          console.error(
            `Location: Line ${err.loc.start.line}, Column ${err.loc.start.column}`,
          );
        }
        throw err;
      }

      try {
        const classMatches = transformedText.matchAll(classAttrRegex);

        for (const [match] of classMatches) {
          const tempHtml = `<div ${match}></div>`;
          const formattedHtml = await prettier.format(tempHtml, {
            ...options,
            parser: 'html',
          });
          const classMatch = formattedHtml.match(classAttrRegex);

          if (classMatch?.[0] !== match) {
            transformedText = transformedText.replace(match, classMatch[0]);
          }
        }
      } catch (err) {
        console.error(
          `Error formatting class attributes within .templ file: ${err.message}`,
        );
      }

      return transformedText;
    },
  },
};

export const defaultOptions = { useTabs: true };
