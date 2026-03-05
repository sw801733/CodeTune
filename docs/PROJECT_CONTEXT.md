# CodeTune Project Context

## Goal

CodeTune은 코드 학습 플랫폼이다.

사용자가 작성한 코드를 AI가 분석하여 다음을 제공한다.

- 코드 피드백
- 힌트
- 리팩터 예시

Frontend는 React이며, Backend는 Spring Boot를 사용한다.

최종 흐름:

Frontend
↓
Spring API (/api/analyze)
↓
LLM(OpenAI)
↓
AI 분석 결과 반환

---

## API Contract

### Request

POST /api/analyze

{
  "problemId": "...",
  "code": "...",
  "attemptWrong": 1
}

### Response

{
  "feedbackText": "...",
  "hint1": "...",
  "refactorExample": "..."
}

---

## Architecture

Frontend
↓
AnalyzeController
↓
AnalyzeService
↓
PromptBuilder
↓
LlmClient (OpenAI)
↓
OpenAI API

---

## Tech Stack

Backend
- Spring Boot 3.x
- Java 17+
- Gradle

LLM
- OpenAI API

HTTP Client
- Spring RestClient or WebClient

---

## Constraints

LLM 출력은 반드시 JSON 형식이어야 한다.

예시:

{
  "feedbackText": "...",
  "hint1": "...",
  "refactorExample": "..."
}

자유 텍스트 응답은 허용하지 않는다.

---

## Security

OpenAI API Key는 반드시 환경변수로 관리한다.

OPENAI_API_KEY

절대 코드나 로그에 노출하면 안 된다.

---

## Non Goals (현재 단계)

- DB 없음
- 로그인 없음
- 사용자 저장 없음
- 문제 데이터는 코드 내부에 존재

---

## Definition of Done

Phase 1 완료 기준

- Spring Boot 서버 실행
- POST /api/analyze 동작
- OpenAI 호출 성공
- JSON 응답 반환