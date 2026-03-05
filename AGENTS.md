# CodeTune Agent Rules

이 저장소에서 작업할 때 다음 규칙을 반드시 따른다.

---

## Architecture Rules

Controller는 얇게 유지한다.

Controller는 다음 역할만 한다.

- Request validation
- Service 호출
- Response 반환

비즈니스 로직은 Service에 위치한다.

---

## LLM Rules

LLM 응답은 반드시 JSON 형식이어야 한다.

필수 필드

- feedbackText
- hint1
- refactorExample

JSON 파싱 실패 시 예외 처리를 구현한다.

---

## Security Rules

OpenAI API Key는 환경변수에서만 읽는다.

예:

OPENAI_API_KEY

절대 코드에 하드코딩하지 않는다.

로그에도 출력하지 않는다.

---

## Code Structure

패키지 구조

com.codetune

common
error

analyze
api
application
infra

---

## Error Handling

다음 에러 케이스를 구분한다.

- OPENAI_UNAUTHORIZED
- OPENAI_RATE_LIMIT
- OPENAI_TIMEOUT
- LLM_PARSE_ERROR

GlobalExceptionHandler를 사용한다.

---

## Code Quality

새로운 의존성 추가 시 이유를 코드에 주석으로 남긴다.

Controller → Service → Client 구조를 유지한다.

Service에서 HTTP 구현을 직접 사용하지 않는다.