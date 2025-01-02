// Execute editor commands
function execCmd(command, value = null) {
  document.execCommand(command, false, value);
  updateOutput();
}

// Generate table in editor
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

// Convert HTML to Wiki Text Markup
function convertToWikiMarkup(html) {
  let markup = html;

  // Convert bold to wiki markup ('''text''')
  markup = markup.replace(/<b>(.*?)<\/b>/g, "'''$1'''");
  markup = markup.replace(/<strong>(.*?)<\/strong>/g, "'''$1'''");

  // Convert italic to wiki markup (''text'')
  markup = markup.replace(/<i>(.*?)<\/i>/g, "''$1''");
  markup = markup.replace(/<em>(.*?)<\/em>/g, "''$1''");

  // Convert underline to wiki markup (__text__)
  markup = markup.replace(/<u>(.*?)<\/u>/g, "__$1__");

  // Convert links to wiki markup ([URL|Text])
  markup = markup.replace(/<a href="(.*?)".*?>(.*?)<\/a>/g, "[$1|$2]");

  // Convert ordered lists to wiki markup (# Item)
  markup = markup.replace(/<ol>(.*?)<\/ol>/gs, function (match, list) {
    return list.replace(/<li>(.*?)<\/li>/g, "# $1");
  });

  // Convert unordered lists to wiki markup (* Item)
  markup = markup.replace(/<ul>(.*?)<\/ul>/gs, function (match, list) {
    return list.replace(/<li>(.*?)<\/li>/g, "* $1");
  });

  // Convert tables to wiki markup
  markup = markup.replace(/<table.*?>/g, "{|");
  markup = markup.replace(/<\/table>/g, "|}");
  markup = markup.replace(/<tr>/g, "|-");
  markup = markup.replace(/<\/tr>/g, "");
  markup = markup.replace(/<td>(.*?)<\/td>/g, "| $1");

  // Remove any remaining HTML tags
  markup = markup.replace(/<.*?>/g, "");

  return markup.trim();
}

// Update output field with Wiki Text Markup
function updateOutput() {
  const editorContent = document.getElementById('editor').innerHTML;
  const wikiMarkup = convertToWikiMarkup(editorContent);
  document.getElementById('output').value = wikiMarkup;
}

// Listen for content changes in the editor
document.getElementById('editor').addEventListener('input', updateOutput);
