import { expect, test } from 'bun:test';
import prettier from 'prettier';
import * as templPlugin from '.';

function formatTempl(input, options = {}) {
  return prettier.format(input, {
    parser: 'templ',
    plugins: [templPlugin, 'prettier-plugin-tailwindcss'],
    singleQuote: true,
    ...options,
  });
}

test('should format JavaScript in script elements', async () => {
  const input = `<div>
	<script>
		(()=>{console.log("Hello world");})();
	</script>
</div>`;
  const result = await formatTempl(input);
  expect(result).toMatchSnapshot();
});

test('should format class attributes (Tailwind CSS ordering example)', async () => {
  const input = `<div class="hover:bg-red-600 bg-red-500 text-white p-4">
	Content
</div>`;
  const result = await formatTempl(input);
  expect(result).toMatchSnapshot();
});

test('should format JavaScript in script elements and class attributes (Tailwind CSS ordering example)', async () => {
  const input = `<div class="hover:bg-blue-600 bg-blue-500 text-white p-4">
	<script>
		(()=>{console.log("Combined test");const x=1;if(x>0){console.log("Hello world");}})();
	</script>
</div>`;
  const result = await formatTempl(input);
  expect(result).toMatchSnapshot();
});

test('should handle multiple script elements', async () => {
  const input = `<div>
	<script>
		(()=>{console.log("First script");})();
	</script>
	<script>
		(()=>{console.log("Second script");})();
	</script>
</div>`;
  const result = await formatTempl(input);
  expect(result).toMatchSnapshot();
});

test('should handle empty script tag', async () => {
  const input = `<div>
	<script>
	</script>
</div>`;
  const result = await formatTempl(input);
  expect(result).toMatchSnapshot();
});

test('should format JavaScript in script elements with attributes', async () => {
  const input = `<div>
	<script type="module">
		import{log}from"./utils.js";log("Hello from module");const data={x:1,y:2};console.log(data);
	</script>
</div>`;
  const result = await formatTempl(input);
  expect(result).toMatchSnapshot();
});

test('should format JSON in script elements with type="importmap"', async () => {
  const input = `<div>
	<script type="importmap">
		{"imports":{"react":"https://cdn.skypack.dev/react","lodash":"https://cdn.skypack.dev/lodash"}}
	</script>
</div>`;
  const result = await formatTempl(input);
  expect(result).toMatchSnapshot();
});

test('should format both script elements and class attributes when templMode is both', async () => {
  const input = `<div class="hover:bg-green-600 bg-green-500 text-white p-4">
	<script>
	  (()=>{console.log("Hello world");})();
	</script>
</div>`;
  const result = await formatTempl(input, { templMode: 'both' });
  expect(result).toMatchSnapshot();
});

test('should only format script elements when templMode is script-only', async () => {
  const input = `<div class="hover:bg-red-600 bg-red-500 text-white p-4">
	<script>
	  (()=>{console.log("Hello world");})();
	</script>
</div>`;
  const result = await formatTempl(input, { templMode: 'script-only' });
  expect(result).toMatchSnapshot();
});

test('should only format class attributes when templMode is class-only', async () => {
  const input = `<div class="hover:bg-blue-600 bg-blue-500 text-white p-4">
	<script>
	  (()=>{console.log("Hello world");})();
	</script>
</div>`;
  const result = await formatTempl(input, { templMode: 'class-only' });
  expect(result).toMatchSnapshot();
});
