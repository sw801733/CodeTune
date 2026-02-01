type Result = "correct" | "wrong" | null;
type AttemptWrong = 0 | 1 | 2;

type AIFeedbackCardProps = {
    result: Result;
    attemptWrong: AttemptWrong;
    hint1: string;
    refactorExample: string;
};

export function AIFeedbackCard({
    result,
    attemptWrong,
    hint1,
    refactorExample
}: AIFeedbackCardProps) {
  const badge =
    result === "correct"
      ? { text: "정답", kind: "ok" as const }
      : result === "wrong"
      ? { text: attemptWrong >= 2 ? "오답 (2차)" : "오답", kind: "ng" as const }
      : null;

  return (
    <div className="card feedback">
      <div className="fbHead">
        <h3 style={{ margin: 0 }}>AI 피드백</h3>
        {badge && <span className={`badge ${badge.kind}`}>{badge.text}</span>}
      </div>

      {result === null && (
        <div className="locked">
          아직 제출되지 않았습니다.
          <br />
          코드를 보고 문제점을 판단한 뒤 제출하세요.
        </div>
      )}

      {result === "correct" && (
        <>
          <div className="fbText">
            (샘플) 문제의 핵심 위험 요소를 올바르게 인지했습니다. 조건식에서 타입 해석 차이가
            발생할 수 있다는 점을 고려한 판단입니다.
          </div>

          <details className="details">
            <summary>리팩토링 예시 보기 (선택)</summary>
            <pre className="codeSmall">
              <code>{refactorExample}</code>
            </pre>
          </details>
        </>
      )}

      {result === "wrong" && (
        <>
          <div className="fbText">
            (샘플) 조건식에서 발생할 수 있는 타입 해석 차이에 대한 고려가 부족합니다. 오답 단계에
            따라 힌트 또는 수정 예시가 제공됩니다.
          </div>

          {attemptWrong >= 1 && (
            <details className="details" open>
              <summary>추가 힌트 보기</summary>
              <div className="hintBox">{hint1}</div>
            </details>
          )}

          {attemptWrong >= 2 && (
            <details className="details" open>
              <summary>수정 예시 코드 보기</summary>
              <pre className="codeSmall">
                <code>{refactorExample}</code>
              </pre>
            </details>
          )}
        </>
      )}
    </div>
  );
}