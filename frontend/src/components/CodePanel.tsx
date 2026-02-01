type CodePanelProps = {
  topicLabel : string;
  title: string;
  code: string;
};

export function CodePanel({ topicLabel, title, code }: CodePanelProps) {
  return (
    <section className="code-panel">
      <div className="meta">{topicLabel}</div>
      <div className="title">{title}</div>
      <pre className="code">
        <code>{code}</code>
      </pre>
    </section>
  );

}
