class WikiEditor {
  constructor(containerId) {
      this.container = document.getElementById(containerId);
      this.init();
  }

  init() {
      // Create editor container
      this.editorContainer = document.createElement('div');
      this.editorContainer.className = 'wiki-editor-container';

      // Create toolbar
      this.toolbar = document.createElement('div');
      this.toolbar.className = 'wiki-editor-toolbar';
      
      // Create editor area
      this.editor = document.createElement('div');
      this.editor.className = 'wiki-editor-content';
      this.editor.contentEditable = true;
      this.editor.setAttribute('role', 'textbox');
      this.editor.setAttribute('aria-multiline', 'true');

      // Add components to container
      this.editorContainer.appendChild(this.toolbar);
      this.editorContainer.appendChild(this.editor);
      this.container.appendChild(this.editorContainer);

      // Create toolbar buttons
      this.createToolbar();
      
      // Add event listeners
      this.addEventListeners();
  }

  createToolbar() {
      const buttons = [
          { icon: '𝐁', command: 'bold', tooltip: 'Bold ('''text''')' },
          { icon: '𝐼', command: 'italic', tooltip: 'Italic (''text'')' },
          { icon: '𝑈', command: 'underline', tooltip: 'Underline (_text_)' },
          { icon: '🔗', command: 'createLink', tooltip: 'Link ([URL|Text])' },
          { icon: '📋', command: 'table', tooltip: 'Table' },
          { icon: '1.', command: 'insertOrderedList', tooltip: 'Numbered List (# Item)' },
          { icon: '•', command: 'insertUnorderedList', tooltip: 'Bullet List (* Item)' }
      ];

      buttons.forEach(btn => {
          const button = document.createElement('button');
          button.innerHTML = btn.icon;
          button.title = btn.tooltip;
          button.className = 'wiki-editor-btn';
          button.addEventListener('click', () => this.handleCommand(btn.command));
          this.toolbar.appendChild(button);
      });
  }

  handleCommand(command) {
      switch(command) {
          case 'createLink':
              const url = prompt('Enter URL:');
              if (url) {
                  const text = window.getSelection().toString() || 'Link Text';
                  this.insertText(`[${url}|${text}]`);
              }
              break;
          case 'table':
              this.insertTable();
              break;
          case 'bold':
              this.wrapText("'''", "'''");
              break;
          case 'italic':
              this.wrapText("''", "''");
              break;
          case 'underline':
              this.wrapText("_", "_");
              break;
          default:
              document.execCommand(command, false, null);
      }
  }

  wrapText(before, after) {
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      const selectedText = range.toString();
      
      if (selectedText) {
          const newText = `${before}${selectedText}${after}`;
          range.deleteContents();
          range.insertNode(document.createTextNode(newText));
      }
  }

  insertTable() {
      const rows = prompt('Number of rows:', '3');
      const cols = prompt('Number of columns:', '3');
      
      if (rows && cols) {
          let tableMarkup = '{|\n';
          for (let i = 0; i < rows; i++) {
              tableMarkup += '|-\n';
              for (let j = 0; j < cols; j++) {
                  tableMarkup += '| Cell ' + ((i * cols) + j + 1) + '\n';
              }
          }
          tableMarkup += '|}';
          this.insertText(tableMarkup);
      }
  }

  insertText(text) {
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(text));
  }

  addEventListeners() {
      this.editor.addEventListener('input', () => {
          // Add any real-time processing here if needed
      });
  }
}

// CSS to be added to your stylesheet
const styles = `
.wiki-editor-container {
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
  font-family: Arial, sans-serif;
}

.wiki-editor-toolbar {
  padding: 8px;
  background: #f5f5f5;
  border-bottom: 1px solid #ddd;
}

.wiki-editor-btn {
  padding: 6px 12px;
  margin: 0 2px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 3px;
  cursor: pointer;
  font-size: 14px;
}

.wiki-editor-btn:hover {
  background: #e9e9e9;
}

.wiki-editor-content {
  min-height: 200px;
  padding: 15px;
  background: white;
  overflow-y: auto;
  line-height: 1.5;
}

.wiki-editor-content:focus {
  outline: none;
}
`;

// Usage:
// 1. Add a container to your HTML:
// <div id="myEditor"></div>

// 2. Initialize the editor:
// const editor = new WikiEditor('myEditor');