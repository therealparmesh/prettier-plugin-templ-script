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
  },
};

export const printers = {
  templ: {
    print: async (path, options) => {
      const { text } = path.getValue();
      const matches = text.matchAll(/^(\s*)<script>([\s\S]+?)<\/script>$/gm);
      let transformedText = text;

      try {
        for (const [match, leadingWhitespace, scriptContent] of matches) {
          const formattedScript = await prettier.format(scriptContent.trim(), {
            ...options,
            parser: 'acorn',
          });

          const indentedScript = formattedScript
            .trim()
            .split('\n')
            .map((line) => `${leadingWhitespace}\t${line}`)
            .join('\n');

          const replacementScript = `${leadingWhitespace}<script>\n${indentedScript}\n${leadingWhitespace}</script>`;
          transformedText = transformedText.replace(match, replacementScript);
        }
      } catch (err) {
        console.error('Error formatting script:', err.message);
        return text;
      }

      return transformedText;
    },
  },
};
