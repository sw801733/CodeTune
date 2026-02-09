// src/types/problem.ts

export type ProblemIssue = {
  title: string;                 // 문제점 제목 (예: 부호 연산 주의)
  description: string;           // 문제점 설명 (항상 노출)
  recommendedApproach: string[]; // 권장 해결 접근 (항상 노출)
};

export type Problem = {
  id: string;
  topic: string;                 // 주제 분류 (형 변환, 포인터 등)
  title: string;                 // 문제 제목
  code: string;                  // 원본 코드 (고정)
  issue: ProblemIssue;

  hint1: string;                 // 오답 1차 힌트
  refactorExample: string;       // 오답 2차 / 정답 시 참고 코드
};