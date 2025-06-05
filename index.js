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
      const matches = text.matchAll(scriptRegex);
      let transformedText = text;

      const singleIndent = options.useTabs
        ? '\t'
        : ' '.repeat(options.tabWidth);

      try {
        for (const [
          match,
          leadingWhitespace,
          scriptAttributes,
          _,
          scriptContent,
        ] of matches) {
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

      return transformedText;
    },
  },
};

export const defaultOptions = {
  useTabs: true,
};
