export type ProgressStatus = "unseen" | "tried" | "solved";
export type Result = "correct" | "wrong" | null;

export type ProgressMap = Record<
    string,
    {
        status: ProgressStatus;
        attemptWrong: number;
        lastResult: Result;
        updatedAt: number;
    }
>;

const KEY = "codetune.progress.v1";

export function updateProgress(
    problemId: string,
    data: {
        status: ProgressStatus;
        attemptWrong: number;
        lastResult: Result;
    }
) {
    const map = loadProgress();
    map[problemId] = {
        ...data,
        updatedAt: Date.now(),
    };
    saveProgress(map);
}

export function getProgress(problemId: string) {
    const map = loadProgress();
    return map[problemId] ?? null;
}

export function loadProgress(): ProgressMap {
    try {
        const raw = localStorage.getItem(KEY);
        if (!raw) return {};
        const parsed = JSON.parse(raw) as ProgressMap;
        if (!parsed || typeof parsed !== "object") return {};
        return parsed;
    } catch (error) {
        console.error("Failed to load progress:", error);
        return {};
    }
}

export function saveProgress(map: ProgressMap) {
    localStorage.setItem(KEY, JSON.stringify(map));
}