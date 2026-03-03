import Editor from "@monaco-editor/react";

type CodePanelProps = {
  topicLabel: string;
  title: string;
  code: string;
  onChange?: (v: string) => void;
};

export function CodePanel({ topicLabel, title, code, onChange }: CodePanelProps) {
  return (
    <section className="code-panel">
      <div className="meta">{topicLabel}</div>
      <div className="title">{title}</div>

      {onChange ? (
        <div className="editor-wrap">
          <Editor
            height="100%"
            defaultLanguage="c"
            value={code}
            onChange={(v) => onChange(v ?? "")}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              wordWrap: "off",
              tabSize: 2,
              insertSpaces: true,
              automaticLayout: true,
            }}
          />
        </div>
      ) : (
        <pre className="code">
          <code>{code}</code>
        </pre>
      )}
    </section>
  );
}