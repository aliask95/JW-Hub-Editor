// Insert headings
function insertHeading(level) {
  const editor = document.getElementById('editor');
  const selection = document.getSelection();
  const text = selection.toString();
  const headingMarkup = '='.repeat(level) + ` ${text} ` + '='.repeat(level);
  replaceSelection(editor, headingMarkup);
}

// Insert text markup
function insertMarkup(type) {
  const editor = document.getElementById('editor');
  const selection = document.getSelection();
  const text = selection.toString();

  let markup = '';
  switch (type) {
    case 'bold':
      markup = `'''${text}'''`;
      break;
    case 'italic':
      markup = `''${text}''`;
      break;
    case 'bold-italic':
      markup = `'''''${text}'''''`;
      break;
    case 'superscript':
      markup = `^${text}^`;
      break;
    case 'monospace':
      markup = `{{{${text}}}}`;
      break;
    case 'line-break':
      markup = `[[BR]]`;
      break;
    case 'unordered-list':
      markup = `* ${text}`;
      break;
    case 'ordered-list':
      markup = `1. ${text}`;
      break;
    case 'link':
      const url = prompt('Enter the URL:', 'http://');
      markup = `[${url} ${text || 'Link'}]`;
      break;
    case 'image':
      const imagePath = prompt('Enter the image path (e.g., folder/myimage.jpg):');
      markup = `[image:(${imagePath})]`;
      break;
  }

  replaceSelection(editor, markup);
}

// Generate a table
function generateTable() {
  const rows = prompt('Enter the number of rows:', 2);
  const cols = prompt('Enter the number of columns:', 2);

  let table = '||';
  for (let c = 0; c < cols; c++) {
    table += `Header ${c + 1}||`;
  }
  table += '\n';

  for (let r = 0; r < rows; r++) {
    table += '||';
    for (let c = 0; c < cols; c++) {
      table += `Row ${r + 1} Col ${c + 1}||`;
    }
    table += '\n';
  }

  const editor = document.getElementById('editor');
  editor.innerHTML += `<pre>${table}</pre>`;
  updateOutput();
}

// Replace selected text with markup
function replaceSelection(editor, markup) {
  const selection = document.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(markup));
    updateOutput();
  }
}

// Sync visual editor with Wiki Markup
function updateOutput() {
  const editorContent = document.getElementById('editor').textContent;
  document.getElementById('output').value = editorContent;
}

// Sync Wiki Markup with visual editor
document.getElementById('output').addEventListener('input', function () {
  const outputContent = this.value;
  const editor = document.getElementById('editor');
  editor.textContent = outputContent;
});
