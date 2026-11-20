const controls = ['m', 'p', 'g', 'r'].map((key) => ({
  input: document.getElementById(`pg-${key}`),
  output: document.getElementById(`o-${key}`),
}));
const marginBox = document.getElementById('pg-m-el');
const paddingBox = document.getElementById('pg-b-el');
const codeBlock = document.getElementById('pg-code');
const code = codeBlock.querySelector('code');
const copy = codeBlock.querySelector('[data-copy]');

function update() {
  const [margin, padding, gap, radius] = controls.map(({ input, output }) => {
    const { min, max, value } = input;
    input.style.setProperty('--p', `${((value - min) / (max - min)) * 100}%`);
    const size = `${value}px`;
    output.textContent = `${value} px`;
    return size;
  });
  marginBox.style.padding = margin;
  marginBox.style.borderRadius = radius;
  paddingBox.style.padding = padding;
  paddingBox.style.gap = gap;
  paddingBox.style.borderRadius = radius;

  const snippet = `.element {\n  margin: ${margin};\n  padding: ${padding};\n  gap: ${gap};\n  border-radius: ${radius};\n}`;
  code.textContent = snippet;
  copy.dataset.copy = snippet;
}

for (const { input } of controls) input.addEventListener('input', update);
update();
