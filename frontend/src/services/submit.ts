import { mockAnalyze, type AttemptWrong, type FeedbackBundle, type Result } from "./analyze";

type ProblemLike = {
    id: string;
    issue: {
        title: string;
        description: string;
        recommendedApproach: string | string[];
    };
    hint1?: string;
    refactorExample?: string | string[];
};

type SubmitArgs = {
    problem: {
        id: string;
        issue: {
            title: string;
            description: string;
            recommendedApproach: string | string[];
        };
        hint1?: string;
        refactorExample?: string | string[];
    };
    code: string;
    attemptWrong: AttemptWrong;
    judgement: Exclude<Result, null>;
};

// ✅ Phase 4-3 준비: API 전환 스위치
// - 지금은 false (목업)
// - 백엔드 준비되면 true로 바꾸고 fetch만 구현하면 됨
const USE_API = false;

export async function submitFeedback(args: SubmitArgs): Promise<FeedbackBundle> {
    if (!USE_API) {
        return mockAnalyze({
            problem: args.problem,
            judgement: args.judgement,
            attemptWrong: args.attemptWrong,
            code: args.code,
        });
    }

    // Phase 4-3: 여기만 실제 API로 교체
    // return await fetch("http://localhost:8080/api/submit", { ... }).then(r => r.json());
    throw new Error("API mode is not implemented yet");
}

export function getRestoredFeedback(params: {
    problem: ProblemLike;
    code: string;
    savedResult: Result;
    savedAttemptWrong: AttemptWrong;
}): FeedbackBundle {
    if (params.savedResult === null) return { feedbackText: "" };
    return mockAnalyze({
        problem: params.problem,
        judgement: params.savedResult,
        attemptWrong: params.savedAttemptWrong,
        code: params.code,
    });
}