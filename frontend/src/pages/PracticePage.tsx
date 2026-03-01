import { useMemo, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { problems } from "../data/problems";
import { CodePanel } from "../components/CodePanel";
import { ProblemDefinitionCard } from "../components/ProblemDefinitionCard";
import { AIFeedbackCard } from "../components/AIFeedbackCard";
import { markSolved, markTried } from "../storage/progress";

type Result = "correct" | "wrong" | null;
type AttemptWrong = 0 | 1 | 2;

export function PracticePage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const hasProblems = problems.length > 0;

    // ✅ URL의 :id 가 source of truth
    const indexFromUrl = hasProblems ? problems.findIndex((p) => p.id === id) : -1;
    const safeIndex = indexFromUrl >= 0 ? indexFromUrl : 0;
    const currentProblem = hasProblems ? problems[safeIndex] : null;

    const [result, setResult] = useState<Result>(null);
    const [attemptWrong, setAttemptWrong] = useState<AttemptWrong>(0);

    const submit = (judgement: Exclude<Result, null>) => {
        if (!currentProblem) return;

        if (judgement === "correct") {
            setResult("correct");
            markSolved(currentProblem.id);
            return;
        }
        setResult("wrong");
        setAttemptWrong((prev) => (prev < 2 ? ((prev + 1) as AttemptWrong) : 2));
        markTried(currentProblem.id);
    };

    const resetForMove = () => {
        setResult(null);
        setAttemptWrong(0);
    };

    useEffect(() => {
        if (!hasProblems) return;
        resetForMove();
    }, [id]);

    const prevProblem = () => {
        if (!hasProblems) return;
        const prevIndex = safeIndex <= 0 ? 0 : safeIndex - 1;
        navigate(`/practice/${problems[prevIndex].id}`);
    };

    const nextProblem = () => {
        if (!hasProblems) return;
        const last = problems.length - 1;
        const nextIndex = safeIndex >= last ? last : safeIndex + 1; // ✅ 순환 없음
        navigate(`/practice/${problems[nextIndex].id}`);
    };

    const badge = useMemo(() => {
        if (result === "correct") return { text: "정답", kind: "ok" as const };
        if (result === "wrong")
            return {
                text: attemptWrong >= 2 ? "오답 (2차)" : "오답",
                kind: "ng" as const,
            };
        return null;
    }, [result, attemptWrong]);

    return (
        <div className="page">
            <header className="topbar">
                <div className="brand" style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <button className="btn ghost" onClick={() => navigate("/")}>
                        목록
                    </button>
                    <span>Practice Prototype</span>
                </div>

                <div className="mini">
                    {hasProblems && (
                        <>
                            문제 <b>{safeIndex + 1}</b> / <b>{problems.length}</b> &nbsp; | &nbsp;
                        </>
                    )}
                    result: <b>{String(result)}</b> / wrongAttempt: <b>{attemptWrong}</b>
                </div>
            </header>

            <main className="grid">
                {!currentProblem ? (
                    <div style={{ padding: "18px" }}>
                        문제가 없습니다. <code>src/data/problems.ts</code>에 문제를 추가하세요.
                    </div>
                ) : (
                    <>
                        <CodePanel
                            topicLabel={currentProblem.topic}
                            title={currentProblem.title}
                            code={currentProblem.code}
                        />

                        <section className="panel right">
                            <ProblemDefinitionCard
                                issueTitle={currentProblem.issue.title}
                                description={currentProblem.issue.description}
                                recommendedApproach={currentProblem.issue.recommendedApproach}
                            />

                            <AIFeedbackCard
                                result={result}
                                attemptWrong={attemptWrong}
                                hint1={currentProblem.hint1}
                                refactorExample={currentProblem.refactorExample}
                            />

                            <div className="actions">
                                <button
                                    className="btn ghost"
                                    disabled={!currentProblem || safeIndex <= 0}
                                    onClick={prevProblem}
                                >
                                    이전 문제
                                </button>

                                {/* ✅ 지금은 개발 중이니까 제출 2개 유지 */}
                                <button
                                    className="btn primary"
                                    disabled={!currentProblem}
                                    onClick={() => submit("correct")}
                                >
                                    제출(정답)
                                </button>
                                <button
                                    className="btn"
                                    disabled={!currentProblem}
                                    onClick={() => submit("wrong")}
                                >
                                    제출(오답)
                                </button>

                                <button
                                    className="btn ghost"
                                    disabled={!currentProblem || safeIndex >= problems.length - 1}
                                    onClick={nextProblem}
                                >
                                    다음 문제
                                </button>
                            </div>
                        </section>
                    </>
                )}
            </main>

            <style>{css}</style>
        </div>
    );
}

// 기존 css 그대로 가져오면 됨 (네 App.tsx에서 복붙)
const css = `
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