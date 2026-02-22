import { Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "./pages/HomePage.tsx";
import { PracticePage } from "./pages/PracticePage.tsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/practice/:id" element={<PracticePage />} />

      {/* 안전망 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}