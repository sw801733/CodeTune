import { Link } from "react-router-dom";
import { use, useEffect, useState } from "react";
import { loadProgress, type ProgressStatus } from "../storage/progress";
import { problems } from "../data/problems";

export function HomePage() {
    const [progress, setProgress] = useState(loadProgress());

    useEffect(() => {
        setProgress(loadProgress());
    }, []);

    return (
        <div style={{ padding: 18, fontFamily: "sans-serif" }}>
            <h1 style={{ margin: "0 0 12px" }}>CodeTune</h1>
            <div style={{ opacity: 0.7, marginBottom: 12 }}>
                문제를 선택해서 연습을 시작하세요.
            </div>

            <div style={{ display: "grid", gap: 10 }}>
                {problems.map((p, idx) => {
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