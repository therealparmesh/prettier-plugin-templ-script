import { expect, test } from 'bun:test';
import prettier from 'prettier';
import * as templPlugin from '.';

function formatTempl(input) {
  return prettier.format(input, {
    parser: 'templ',
    plugins: [templPlugin, 'prettier-plugin-tailwindcss'],
    singleQuote: true,
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

test('should handle mutliple script elements', async () => {
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
