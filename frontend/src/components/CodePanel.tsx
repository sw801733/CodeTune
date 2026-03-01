type CodePanelProps = {
  topicLabel: string;
  title: string;
  code: string;
  onChange?: (v: string) => void; // 선택적 onChange 핸들러
};

export function CodePanel({ topicLabel, title, code, onChange }: CodePanelProps) {
  return (
    <section className="code-panel">
      <div className="meta">{topicLabel}</div>
      <div className="title">{title}</div>
      {onChange ? (
        <textarea
          className="code code-input"
          value={code}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
        />
      ) : (
        <pre className="code">
          <code>{code}</code>
        </pre>
      )}
    </section>
  );
}
