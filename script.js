// JW Hub Editor - WYSIWYG Wiki Text Editor
const JWHubEditor = {
  // Core components
  editor: null,
  outputField: null,
  previewPane: null,

  // Initialize the editor
  init: function() {
    this.setupEditor();
    this.setupEventListeners();
    this.createToolbar();
  },

  // Setup the WYSIWYG editor
  setupEditor: function() {
    this.editor = document.getElementById('editor');
    this.outputField = document.getElementById('wiki-output');
    this.previewPane = document.getElementById('preview-pane');

    // Initialize with basic contentEditable
    this.editor.contentEditable = true;
    this.editor.className = 'jw-editor-area';
  },

  // Setup event listeners for real-time conversion
  setupEventListeners: function() {
    this.editor.addEventListener('input', () => {
      this.convertToWikiMarkup();
    });
  },

  // Create toolbar with formatting options
  createToolbar: function() {
    const toolbar = document.createElement('div');
    toolbar.className = 'jw-editor-toolbar';
    
    const buttons = [
      { icon: 'B', command: 'bold', tooltip: 'Bold' },
      { icon: 'I', command: 'italic', tooltip: 'Italic' },
      { icon: 'U', command: 'underline', tooltip: 'Underline' },
      { icon: '🔗', command: 'createLink', tooltip: 'Insert Link' },
      { icon: '📋', command: 'insertTable', tooltip: 'Insert Table' },
      { icon: '1.', command: 'insertOrderedList', tooltip: 'Ordered List' },
      { icon: '•', command: 'insertUnorderedList', tooltip: 'Unordered List' }
    ];

    buttons.forEach(btn => {
      const button = document.createElement('button');
      button.innerHTML = btn.icon;
      button.title = btn.tooltip;
      button.addEventListener('click', () => this.executeCommand(btn.command));
      toolbar.appendChild(button);
    });

    this.editor.parentNode.insertBefore(toolbar, this.editor);
  },

  // Execute formatting commands
  executeCommand: function(command) {
    if (command === 'createLink') {
      const url = prompt('Enter URL:');
      if (url) document.execCommand(command, false, url);
    } else if (command === 'insertTable') {
      this.insertTable();
    } else {
      document.execCommand(command, false, null);
    }
    this.convertToWikiMarkup();
  },

  // Insert table helper
  insertTable: function() {
    const rows = prompt('Enter number of rows:', '2');
    const cols = prompt('Enter number of columns:', '2');
    
    let table = '<table><tbody>';
    for (let i = 0; i < rows; i++) {
      table += '<tr>';
      for (let j = 0; j < cols; j++) {
        table += '<td>Cell</td>';
      }
      table += '</tr>';
    }
    table += '</tbody></table>';
    
    this.insertHTML(table);
  },

  // Insert HTML helper
  insertHTML: function(html) {
    document.execCommand('insertHTML', false, html);
  },

  // Convert HTML to Wiki Markup
  convertToWikiMarkup: function() {
    let content = this.editor.innerHTML;
    let wikiText = content
      // Convert basic formatting
      .replace(/<strong>|<b>/g, "'''")
      .replace(/<\/strong>|<\/b>/g, "'''")
      .replace(/<em>|<i>/g, "''")
      .replace(/<\/em>|<\/i>/g, "''")
      .replace(/<u>(.*?)<\/u>/g, "_$1_")
      
      // Convert links
      .replace(/<a href="(.*?)">(.*?)<\/a>/g, "[$1|$2]")
      
      // Convert lists
      .replace(/<ul>(.*?)<\/ul>/gs, (match, items) => {
        return items.replace(/<li>(.*?)<\/li>/g, "* $1\n");
      })
      .replace(/<ol>(.*?)<\/ol>/gs, (match, items) => {
        return items.replace(/<li>(.*?)<\/li>/g, "# $1\n");
      })
      
      // Convert tables
      .replace(/<table>(.*?)<\/table>/gs, (match, tableContent) => {
        let wiki = "{|\n";
        tableContent = tableContent.replace(/<tr>(.*?)<\/tr>/g, (row, cells) => {
          return "|-\n" + cells.replace(/<td>(.*?)<\/td>/g, "| $1\n");
        });
        return wiki + tableContent + "|}";
      })
      
      // Clean up
      .replace(/\n\n+/g, "\n")
      .trim();

    // Update output and preview
    this.outputField.value = wikiText;
    this.updatePreview(wikiText);
  },

  // Update preview pane
  updatePreview: function(wikiText) {
    let html = wikiText
      .replace(/'''(.*?)'''/g, "<strong>$1</strong>")
      .replace(/''(.*?)''/g, "<em>$1</em>")
      .replace(/_(.*?)_/g, "<u>$1</u>")
      .replace(/\[\[(.*?)\]\]/g, "<a href='$1'>$1</a>")
      .replace(/\* (.*?)\n/g, "<li>$1</li>")
      .replace(/# (.*?)\n/g, "<li>$1</li>");

    this.previewPane.innerHTML = html;
  }
};

// Initialize the editor when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  JWHubEditor.init();
});