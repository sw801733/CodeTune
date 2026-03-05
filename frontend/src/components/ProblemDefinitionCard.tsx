type ProblemDefinitionCardProps = {
  issueTitle: string;
  description: string;
  recommendedApproach: string | string[];
};

export function ProblemDefinitionCard({
  issueTitle,
  description,
  recommendedApproach
}: ProblemDefinitionCardProps) {

  const approaches = Array.isArray(recommendedApproach)
    ? recommendedApproach
    : [recommendedApproach];

  return (
    <div className="card issue">
      <h3>발견된 문제점</h3>
      <div className="issueTitle">{issueTitle}</div>
      <p className="desc">{description}</p>

      <div className="approach">
        <div className="approachK">권장 해결 접근</div>
        <ul>
          {approaches.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}