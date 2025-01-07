require.config({ paths: { vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.41.0/min/vs" } });
require(["vs/editor/editor.main"], function () {
  const editorModel = {
    content: "",
  };

  const wysiwygEditor = new window.tiptap.Editor({
    element: document.querySelector("#wysiwyg"),
    extensions: [window.tiptap.StarterKit],
    content: editorModel.content,
    onUpdate: ({ editor }) => {
      editorModel.content = editor.getHTML();
      monacoEditor.setValue(editorModel.content);
    },
  });

  const monacoEditor = monaco.editor.create(document.querySelector("#code"), {
    value: editorModel.content,
    language: "html",
    theme: "vs-dark",
    automaticLayout: true,
  });

  monacoEditor.onDidChangeModelContent(() => {
    editorModel.content = monacoEditor.getValue();
    wysiwygEditor.commands.setContent(editorModel.content);
  });

  document.getElementById("bold-btn").addEventListener("click", () => {
    wysiwygEditor.commands.toggleBold();
  });

  document.getElementById("italic-btn").addEventListener("click", () => {
    wysiwygEditor.commands.toggleItalic();
  });

  document.getElementById("underline-btn").addEventListener("click", () => {
    wysiwygEditor.commands.toggleUnderline();
  });

  document.getElementById("insert-table-btn").addEventListener("click", () => {
    wysiwygEditor.commands.insertTable({ rows: 3, cols: 3 });
  });
});
