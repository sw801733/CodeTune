type Result = "correct" | "wrong" | null;
type AttemptWrong = 0 | 1 | 2;

type AIFeedbackCardProps = {
  result: Result;
  attemptWrong: AttemptWrong;
  // ✅ Phase 4-1: 제출 결과에 대한 텍스트(모의 분석/AI 응답)
  feedbackText: string;
  // ✅ 오답 1차 힌트(선택)
  hint1?: string;
  // ✅ 오답 2차 또는 정답 시 리팩토링 예시(선택)
  refactorExample?: string;
};

export function AIFeedbackCard({
  result,
  attemptWrong,
  feedbackText,
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
            {feedbackText || "정답입니다."}
          </div>

          {refactorExample && (
            <details className="details">
              <summary>리팩토링 예시 보기 (선택)</summary>
              <pre className="codeSmall">
                <code>{refactorExample}</code>
              </pre>
            </details>
          )}
        </>
      )}

      {result === "wrong" && (
        <>
          <div className="fbText">
            {feedbackText || "오답입니다."}
          </div>

          {attemptWrong >= 1 && hint1 && (
            <details className="details" open>
              <summary>추가 힌트 보기</summary>
              <div className="hintBox">{hint1}</div>
            </details>
          )}

          {attemptWrong >= 2 && refactorExample && (
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