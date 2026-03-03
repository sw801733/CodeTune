export type Result = "correct" | "wrong" | null;
export type AttemptWrong = 0 | 1 | 2;

export type FeedbackBundle = {
    feedbackText: string;
    hint1?: string;
    refactorExample?: string
};

type AnalyzeArgs = {
    problem: {
        issue: {
            title: string;
            description: string;
            recommendedApproach: string | string[];
        };
        hint1?: string;
        refactorExample?: string | string[];
    };
    judgement: Exclude<Result, null>;
    attemptWrong: AttemptWrong;
    code: string;
};

// Phase 4-1: 프론트 목업 분석기 (나중에 서버/AI로 대체)
export function mockAnalyze({ problem, judgement, attemptWrong }: AnalyzeArgs): FeedbackBundle {
    const approachText = Array.isArray(problem.issue.recommendedApproach)
        ? problem.issue.recommendedApproach.join("\n- ")
        : problem.issue.recommendedApproach;

    const refactorText = Array.isArray(problem.refactorExample)
        ? problem.refactorExample.join("\n")
        : problem.refactorExample;

    if (judgement === "correct") {
        return {
            feedbackText:
                `✅ 정답 처리되었습니다.\n` +
                `- 포인트: ${problem.issue.title}\n` +
                `- 이유: ${problem.issue.description}`,
        };
    }

    const base =
        `❌ 아직 의도한 안전한 형태가 아닙니다.\n` +
        `- 문제점: ${problem.issue.title}\n` +
        `- 관찰: ${problem.issue.description}`;

    const hint =
        attemptWrong >= 1
            ? problem.hint1
                ? `힌트: ${problem.hint1}`
                : `힌트:\n- ${approachText}`
            : undefined;

    const ex = attemptWrong >= 2 ? refactorText : undefined;

    return {
        feedbackText: base,
        hint1: hint,
        refactorExample: ex,
    };
}