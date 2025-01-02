// Execute editor commands
function execCmd(command, value = null) {
  document.execCommand(command, false, value);
  updateOutputFromEditor();
}

// Generate table in Wiki Text Markup format
function generateTable() {
  const rows = prompt('Enter the number of rows (including the header row):', 3);
  const cols = prompt('Enter the number of columns:', 3);

  if (rows && cols) {
    let table = '||';
    for (let j = 0; j < cols; j++) {
      table += `Column ${j + 1}[attr: width="15%" style="text-align: center;"] ||`;
    }
    table += '\n';

    for (let i = 1; i < rows; i++) {
      table += '||';
      for (let j = 0; j < cols; j++) {
        table += `Row ${i} Col ${j + 1} ||`;
      }
      table += '\n';
    }

    document.execCommand('insertHTML', false, `<pre>${table}</pre>`);
    updateOutputFromEditor();
  }
}

// Convert HTML to Wiki Markup
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
  markup = markup.replace(/<table.*?>/g, "||");
  markup = markup.replace(/<\/table>/g, "");
  markup = markup.replace(/<tr>/g, "||");
  markup = markup.replace(/<\/tr>/g, "");
  markup = markup.replace(/<td>(.*?)<\/td>/g, "| $1 ||");

  // Remove any remaining HTML tags
  markup = markup.replace(/<.*?>/g, "");

  return markup.trim();
}

// Convert Wiki Markup to HTML
function convertToHTML(markup) {
  let html = markup;

  // Convert bold wiki markup ('''text''') to <b>
  html = html.replace(/'''(.*?)'''/g, "<b>$1</b>");

  // Convert italic wiki markup (''text'') to <i>
  html = html.replace(/''(.*?)''/g, "<i>$1</i>");

  // Convert underline wiki markup (__text__) to <u>
  html = html.replace(/__(.*?)__/g, "<u>$1</u>");

  // Convert links wiki markup ([URL|Text]) to <a>
  html = html.replace(/\[(.*?)\|(.*?)\]/g, '<a href="$1">$2</a>');

  // Convert ordered lists (# Item) to <ol><li>
  html = html.replace(/^# (.*?)$/gm, "<li>$1</li>");
  html = html.replace(/<li>(.*?)<\/li>/g, "<ol><li>$1</li></ol>");

  // Convert unordered lists (* Item) to <ul><li>
  html = html.replace(/^\* (.*?)$/gm, "<li>$1</li>");
  html = html.replace(/<li>(.*?)<\/li>/g, "<ul><li>$1</li></ul>");

  // Convert tables
  html = html.replace(/\|\|(.*?)\|\|/g, function (match, row) {
    let cells = row.split("||").map((cell) => `<td>${cell.trim()}</td>`);
    return `<tr>${cells.join("")}</tr>`;
  });

  // Wrap the table rows in <table>
  html = html.replace(/<tr>(.*?)<\/tr>/gs, "<table><tr>$1</tr></table>");

  return html.trim();
}

// Update Wiki Markup field from Visual Editor
function updateOutputFromEditor() {
  const editorContent = document.getElementById('editor').innerHTML;
  const wikiMarkup = convertToWikiMarkup(editorContent);
  document.getElementById('output').value = wikiMarkup;
}

// Update Visual Editor from Wiki Markup field
function updateEditorFromOutput() {
  const wikiMarkup = document.getElementById('output').value;
  const htmlContent = convertToHTML(wikiMarkup);
  document.getElementById('editor').innerHTML = htmlContent;
}

// Add event listeners for both fields
document.getElementById('editor').addEventListener('input', updateOutputFromEditor);
document.getElementById('output').addEventListener('input', updateEditorFromOutput);
