import { Link } from "react-router-dom";
import { problems } from "../data/problems";

export function HomePage() {
    return (
        <div style={{ padding: 18, fontFamily: "sans-serif" }}>
            <h1 style={{ margin: "0 0 12px" }}>CodeTune</h1>
            <div style={{ opacity: 0.7, marginBottom: 12 }}>
                문제를 선택해서 연습을 시작하세요.
            </div>

            <div style={{ display: "grid", gap: 10 }}>
                {problems.map((p, idx) => (
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
                        <div style={{ fontSize: 12, opacity: 0.7 }}>
                            {idx + 1}. {p.topic}
                        </div>
                        <div style={{ fontWeight: 800 }}>{p.title}</div>
                    </Link>
                ))}
            </div>
        </div>
    );
}