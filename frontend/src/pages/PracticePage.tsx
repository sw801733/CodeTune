import { useMemo, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { problems } from "../data/problems";
import { CodePanel } from "../components/CodePanel";
import { ProblemDefinitionCard } from "../components/ProblemDefinitionCard";
import { AIFeedbackCard } from "../components/AIFeedbackCard";
import { getProgress, updateProgress } from "../storage/progress";
import { type AttemptWrong, type Result } from "../services/analyze";
import { submitFeedback, getRestoredFeedback } from "../services/submit";

type FeedbackState = {
    feedbackText: string;
    hint1?: string;
    refactorExample?: string;
};

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
    const [userCode, setUserCode] = useState<string>(currentProblem?.code ?? "");
    const [feedback, setFeedback] = useState<FeedbackState>({ feedbackText: "" });

    const applyResult = (
        judgement: Exclude<Result, null>,
        nextAttemptWrong: AttemptWrong
    ) => {
        setResult(judgement);
        if (judgement === "wrong") {
            setAttemptWrong(nextAttemptWrong);
        }
    };

    const submit = async (judgement: Exclude<Result, null>) => {
        if (!currentProblem) return;

        const nextAttemptWrong =
            judgement === "wrong"
                ? Math.min(attemptWrong + 1, 2)
                : attemptWrong;

        const payload = {
            problemId: currentProblem.id,
            code: userCode,
            attemptWrong: nextAttemptWrong,
            clientTimestamp: Date.now(),
        };

        console.log("[submit payload]", payload);

        // ✅ 상태 적용 (한 번만)
        applyResult(judgement, nextAttemptWrong as AttemptWrong);

        const fb = await submitFeedback({
            problem: currentProblem,
            judgement,
            attemptWrong: nextAttemptWrong as AttemptWrong,
            code: userCode,
        });

        setFeedback(fb);

        updateProgress(currentProblem.id, {
            status: judgement === "correct" ? "solved" : "tried",
            attemptWrong: nextAttemptWrong,
            lastResult: judgement,
        });
    };

    const resetForMove = () => {
        setResult(null);
        setAttemptWrong(0);
        setFeedback({ feedbackText: "" });
    };

    useEffect(() => {
        if (!currentProblem) return;

        const saved = getProgress(currentProblem.id);

        if (saved) {
            setResult(saved.lastResult);
            setAttemptWrong(saved.attemptWrong as AttemptWrong);
        } else {
            resetForMove();
        }
        setUserCode(currentProblem?.code ?? "");

        // Phase 4-1: 저장된 상태가 있으면 그 상태 기준으로 목업 피드백도 복원
        if (saved) {
            const jb = (saved.lastResult ?? "wrong") as Exclude<Result, null>;
            const fb = getRestoredFeedback({
                problem: currentProblem,
                code: currentProblem.code,
                savedResult: jb,
                savedAttemptWrong: (saved.attemptWrong as AttemptWrong) ?? 0,
            });
            setFeedback(fb);
        } else {
            setFeedback({ feedbackText: "" });
        }
    }, [currentProblem?.id]);

    const resetCode = () => {
        if (!currentProblem) return;
        setUserCode(currentProblem.code);
    };

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
                            code={userCode}
                            onChange={setUserCode}
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
                                feedbackText={feedback.feedbackText}
                                hint1={feedback.hint1}
                                refactorExample={feedback.refactorExample}
                            />

                            <div className="actions">
                                <button
                                    className="btn ghost"
                                    disabled={!currentProblem}
                                    onClick={resetCode}
                                >
                                    Reset
                                </button>

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
  .codeInput{
  width:100%;
  resize:none;
  outline:none;
  color:inherit;
  font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;
  }
  .code-panel{
  height:100%;
  display:flex;
  flex-direction:column;
  gap:8px;
}
.editor-wrap{
  flex:1;
  min-height:0;        /* grid/flex 내부에서 Monaco 스크롤 제대로 되게 하는 핵심 */
  border:1px solid #22254a;
  border-radius:10px;
  overflow:hidden;     /* Monaco 모서리 깔끔하게 */
  background:#15182a;
}`;