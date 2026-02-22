export type ProgressStatus = "unseen" | "tried" | "solved";

export type ProgressMap = Record<
    string,
    {
        status: ProgressStatus;
        updatedAt: number;
    }
>;

const KEY = "codetune.progress.v1";

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

export function getStatus(problemId: string): ProgressStatus {
    const map = loadProgress();
    return map[problemId]?.status ?? "unseen";
}

export function setStatus(problemId: string, status: ProgressStatus) {
    const map = loadProgress();
    map[problemId] = { status, updatedAt: Date.now() };
    saveProgress(map);
}

export function markTried(problemId: string) {
    const cur = getStatus(problemId);
    if (cur == "solved") return; // solved는 tried로 내려가지 않음
    setStatus(problemId, "tried");
}

export function markSolved(problemId: string) {
    setStatus(problemId, "solved");
}