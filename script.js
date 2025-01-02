// Insert markup for text formatting
function insertMarkup(type) {
  const editor = document.getElementById('editor');
  const selection = document.getSelection();
  const selectedText = selection.toString();

  let markup = '';
  switch (type) {
    case 'bold':
      markup = `'''${selectedText}'''`;
      break;
    case 'italic':
      markup = `''${selectedText}''`;
      break;
    case 'bold-italic':
      markup = `'''''${selectedText}'''''`;
      break;
    case 'superscript':
      markup = `^${selectedText}^`;
      break;
    case 'monospace':
      markup = `{{{${selectedText}}}}`;
      break;
    case 'line-break':
      markup = `[[BR]]`;
      break;
    case 'unordered-list':
      markup = `* ${selectedText}`;
      break;
    case 'ordered-list':
      markup = `1. ${selectedText}`;
      break;
  }

  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(markup));
  }
  updateOutput();
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

// Update the Wiki Markup field
function updateOutput() {
  const editorContent = document.getElementById('editor').textContent;
  document.getElementById('output').value = editorContent;
}

// Sync changes from Wiki Markup to the editor
document.getElementById('output').addEventListener('input', function () {
  const outputContent = this.value;
  const editor = document.getElementById('editor');
  editor.textContent = outputContent;
});
