// Execute editor commands
function execCmd(command, value = null) {
  document.execCommand(command, false, value);
  updateOutput();
}

// Generate table
function generateTable() {
  const rows = prompt('Enter the number of rows:', 2);
  const cols = prompt('Enter the number of columns:', 2);
  if (rows && cols) {
    let table = '<table border="1" style="border-collapse: collapse; width: 100%;">';
    for (let i = 0; i < rows; i++) {
      table += '<tr>';
      for (let j = 0; j < cols; j++) {
        table += '<td>&nbsp;</td>';
      }
      table += '</tr>';
    }
    table += '</table>';
    document.execCommand('insertHTML', false, table);
    updateOutput();
  }
}

// Update code output
function updateOutput() {
  const editorContent = document.getElementById('editor').innerHTML;
  document.getElementById('output').value = editorContent;
}

// Listen for content changes in the editor
document.getElementById('editor').addEventListener('input', updateOutput);
