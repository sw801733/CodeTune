import { Link } from "react-router-dom";
import { use, useEffect, useState } from "react";
import { loadProgress, type ProgressStatus } from "../storage/progress";
import { problems } from "../data/problems";

export function HomePage() {
    const [progress, setProgress] = useState(loadProgress());
    const [sortUnsolvedFirst, setSortUnsolvedFirst] = useState(true);

    const solvedCount = problems.filter((p) => progress[p.id]?.status === "solved").length;
    const triedCount = problems.filter((p) => progress[p.id]?.status === "tried").length;
    const totalCount = problems.length;

    const displayedProblems = [...problems].sort((a, b) => {
        if (!sortUnsolvedFirst) return 0; // 정렬 안 함

        const statusA = progress[a.id]?.status ?? "unseen";
        const statusB = progress[b.id]?.status ?? "unseen";

        const rank = (status: string) => (status === "unseen" ? 2 : status === "tried" ? 1 : 0);
        return rank(statusA) - rank(statusB);
    });

    useEffect(() => {
        setProgress(loadProgress());
    });

    return (
        <div style={{ padding: 18, fontFamily: "sans-serif" }}>
            <h1 style={{ margin: "0 0 12px" }}>CodeTune</h1>
            <div style={{ opacity: 0.7, marginBottom: 12 }}>
                문제를 선택해서 연습을 시작하세요.
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
                <div style={{ fontSize: 12, opacity: 0.8 }}>
                    해결 <b>{solvedCount}</b> / <b>{totalCount}</b> · 시도함 <b>{triedCount}</b>
                </div>
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
                <div style={{ fontSize: 12, opacity: 0.8 }}>
                    해결 <b>{solvedCount}</b> / <b>{totalCount}</b> · 시도함 <b>{triedCount}</b>
                </div>

                <button
                    onClick={() => setSortUnsolvedFirst((v) => !v)}
                    style={{
                        fontSize: 12,
                        padding: "6px 10px",
                        borderRadius: 999,
                        border: "1px solid #ddd",
                        background: "transparent",
                        cursor: "pointer",
                    }}
                >
                    {sortUnsolvedFirst ? "미해결 먼저: ON" : "미해결 먼저: OFF"}
                </button>
            </div>

            <div style={{ display: "grid", gap: 10 }}>
                {displayedProblems.map((p, idx) => {
                    const status = progress[p.id]?.status ?? "unseen";
                    return (
                        <Link
                            key={p.id}
                            to={`/practice/${p.id}`}
                            style={{
                                padding: 12,
                                border: "1px solid #ddd",
                                borderRadius: 10,
                                textDecoration: "none",
                                color: "inherit",
                                display: "grid",
                                gap: 6,
                            }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                                <div style={{ fontWeight: 800 }}>{p.title}</div>

                                <span
                                    style={{
                                        fontSize: 12,
                                        padding: "4px 8px",
                                        borderRadius: 999,
                                        border: "1px solid #ddd",
                                        opacity: status === "unseen" ? 0.5 : 1,
                                    }}
                                >
                                    {status === "unseen" ? "미시도" : status === "tried" ? "시도함" : "해결"}
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}