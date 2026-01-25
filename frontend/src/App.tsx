import { useMemo, useState } from "react";

type Result = "correct" | "wrong" | null;
type AttemptWrong = 0 | 1 | 2;

type Problem = {
  topicLabel: string;
  title: string;
  code: string;
  issue: {
    title: string;
    description: string;
    recommendedApproach: string[];
  };
  hint1: string;
  refactorExample: string;
};

const demoProblem: Problem = {
  topicLabel: "정수 / 형 변환",
  title: "부호가 다른 정수의 조건식",
  code: `#include <stdint.h>

void process(uint16_t len)
{
    int8_t offset = -1;

    if (len + offset > 0)
    {
        /* ... */
    }
}`,
  issue: {
    title: "부호 연산 주의",
    description:
      "부호가 다른 정수들이 함께 연산되면 조건식/비교에서 값이 의도와 다르게 해석될 수 있습니다. 이런 차이는 특정 입력에서만 드러나 디버깅이 어려운 잠재 오류로 이어질 수 있습니다.",
    recommendedApproach: [
      "부호/폭이 다른 값이 섞이는 연산이 있는지 먼저 확인",
      "조건식은 계산과 비교를 분리해 의도를 드러내기",
    ],
  },
  hint1:
    "조건식 안에 연산(+, -, *, /)이 섞여 있다면, 참여하는 값들의 부호/폭이 같은지부터 확인하세요. 계산을 중간 변수로 분리하면 비교가 명확해집니다.",
  refactorExample: `int32_t sum = (int32_t)len + (int32_t)offset;
if (sum > 0)
{
    /* ... */
}`,
};

export default function App() {
  const [result, setResult] = useState<Result>(null);
  const [attemptWrong, setAttemptWrong] = useState<AttemptWrong>(0);

  /**
   * 제출 로직
   * - 정답: result=correct
   * - 오답: result=wrong, attemptWrong 증가(최대 2)
   */
  const submit = (judgement: Exclude<Result, null>) => {
    if (judgement === "correct") {
      setResult("correct");
      return;
    }

    // wrong
    setResult("wrong");
    setAttemptWrong((prev) => (prev < 2 ? ((prev + 1) as AttemptWrong) : 2));
  };

  const nextProblem = () => {
    setResult(null);
    setAttemptWrong(0);
  };

  const badge = useMemo(() => {
    if (result === "correct") return { text: "정답", kind: "ok" as const };
    if (result === "wrong")
      return { text: attemptWrong >= 2 ? "오답 (2차)" : "오답", kind: "ng" as const };
    return null;
  }, [result, attemptWrong]);

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">Practice Prototype</div>
        <div className="mini">
          result: <b>{String(result)}</b> / wrongAttempt: <b>{attemptWrong}</b>
        </div>
      </header>

      <main className="grid">
        {/* LEFT */}
        <section className="panel left">
          <div className="meta">{demoProblem.topicLabel}</div>
          <div className="title">{demoProblem.title}</div>
          <pre className="code">
            <code>{demoProblem.code}</code>
          </pre>
        </section>

        {/* RIGHT */}
        <section className="panel right">
          {/* Problem definition (항상 고정) */}
          <div className="card issue">
            <h3>발견된 문제점</h3>
            <div className="issueTitle">{demoProblem.issue.title}</div>
            <p className="desc">{demoProblem.issue.description}</p>

            <div className="approach">
              <div className="approachK">권장 해결 접근</div>
              <ul>
                {demoProblem.issue.recommendedApproach.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* AI Feedback */}
          <div className="card feedback">
            <div className="fbHead">
              <h3 style={{ margin: 0 }}>AI 피드백</h3>
              {badge && <span className={`badge ${badge.kind}`}>{badge.text}</span>}
            </div>

            {/* 제출 전 */}
            {result === null && (
              <div className="locked">
                아직 제출되지 않았습니다.  
                코드를 보고 문제점을 판단한 뒤 제출하세요.
              </div>
            )}

            {/* 정답 */}
            {result === "correct" && (
              <>
                <div className="fbText">
                  (샘플) 문제의 핵심 위험 요소를 올바르게 인지했습니다.
                  조건식에서 타입 해석 차이가 발생할 수 있다는 점을 고려한 판단입니다.
                </div>

                <details className="details">
                  <summary>리팩토링 예시 보기 (선택)</summary>
                  <pre className="codeSmall">
                    <code>{demoProblem.refactorExample}</code>
                  </pre>
                </details>
              </>
            )}

            {/* 오답 */}
            {result === "wrong" && (
              <>
                <div className="fbText">
                  (샘플) 조건식에서 발생할 수 있는 타입 해석 차이에 대한 고려가 부족합니다.
                  오답 단계에 따라 힌트 또는 수정 예시가 제공됩니다.
                </div>

                {attemptWrong >= 1 && (
                  <details className="details" open>
                    <summary>추가 힌트 보기</summary>
                    <div className="hintBox">{demoProblem.hint1}</div>
                  </details>
                )}

                {attemptWrong >= 2 && (
                  <details className="details" open>
                    <summary>수정 예시 코드 보기</summary>
                    <pre className="codeSmall">
                      <code>{demoProblem.refactorExample}</code>
                    </pre>
                  </details>
                )}
              </>
            )}
          </div>

          {/* Actions */}
          <div className="actions">
            <button className="btn primary" onClick={() => submit("correct")}>
              제출(정답)
            </button>
            <button className="btn" onClick={() => submit("wrong")}>
              제출(오답)
            </button>
            <button className="btn ghost" onClick={nextProblem}>
              다음 문제
            </button>
          </div>
        </section>
      </main>

      <style>{css}</style>
    </div>
  );
}

const css = `
/* (CSS는 이전 버전과 동일 — 생략 없이 그대로 사용) */
  .page{min-height:100vh;background:#0f1220;color:#e6e8ef;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Noto Sans KR",sans-serif;}
  .topbar{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid #2a2d3e;background:#0d1020;}
  .brand{font-weight:900;}
  .mini{font-size:12px;color:#c7c9d9;}
  .grid{display:grid;grid-template-columns:2fr 1fr;height:calc(100vh - 54px);}
  .panel{padding:18px;}
  .left{border-right:1px solid #2a2d3e;display:flex;flex-direction:column;gap:8px;}
  .right{display:grid;grid-template-rows:auto 1fr auto;gap:14px;}
  .meta{font-size:13px;color:#8f93ff;}
  .title{font-size:16px;font-weight:900;}
  .code{flex:1;margin:0;background:#15182a;border:1px solid #22254a;border-radius:10px;padding:16px;overflow:auto;font-size:13px;line-height:1.6;}
  .card{background:#15182a;border:1px solid #22254a;border-radius:12px;padding:16px;}
  .issue{border-left:4px solid #ff5c5c;}
  .issueTitle{font-size:18px;font-weight:900;color:#ff6b6b;}
  .desc{font-size:13px;color:#c7c9d9;line-height:1.55;}
  .approach{background:#1b1f3a;border:1px solid #2a2f63;border-radius:10px;padding:10px 12px;color:#aab0ff;font-size:13px;}
  .approachK{color:#e6e8ef;font-weight:900;}
  .feedback{border-left:4px solid #4da3ff;}
  .fbHead{display:flex;justify-content:space-between;align-items:center;}
  .badge{font-size:12px;font-weight:900;padding:6px 10px;border-radius:999px;}
  .badge.ok{background:rgba(61,214,136,.14);color:#7ff0b5;}
  .badge.ng{background:rgba(255,92,92,.12);color:#ff8a8a;}
  .locked{background:#12152a;border:1px dashed #2a2d3e;border-radius:10px;padding:12px;color:#9aa0b8;}
  .fbText{background:#12152a;border:1px solid #24284b;border-radius:10px;padding:12px;color:#c7c9d9;}
  .details summary{cursor:pointer;color:#aab0ff;font-size:12px;}
  .hintBox{background:#1b1f3a;border:1px solid #2a2f63;border-radius:10px;padding:12px;}
  .codeSmall{background:#0f132d;border:1px solid #242a57;border-radius:10px;padding:12px;font-size:12px;}
  .actions{display:flex;gap:10px;}
  .btn{background:#1c2040;border:1px solid #2f3360;border-radius:10px;padding:10px 12px;color:#e6e8ef;font-weight:900;}
  .btn.primary{background:#2b62ff;border-color:#2b62ff;color:#fff;}
  .btn.ghost{background:transparent;}
`;