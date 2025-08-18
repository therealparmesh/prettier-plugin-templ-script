# prettier-plugin-templ-script

> Prettier plugin for .templ files with script element and class attribute formatting.

**Note: This cannot work with nested script elements.**

## Features

- Formats JavaScript in script elements (defaults to tabs for Go convention consistency)
- Formats class attributes in all elements (compatible with [Tailwind's Prettier plugin](https://github.com/tailwindlabs/prettier-plugin-tailwindcss))

## Install

```sh
npm install --save-dev prettier-plugin-templ-script
```

## Usage

```json
{
  "plugins": ["prettier-plugin-templ-script"]
}
```

## Configuration

### `templMode`

Control which parts of templ files to format.

- `"both"` (default) - Format both script and class attributes
- `"script-only"` - Format only script elements
- `"class-only"` - Format only class attributes

```json
{
  "plugins": ["prettier-plugin-templ-script"],
  "templMode": "both"
}
```
