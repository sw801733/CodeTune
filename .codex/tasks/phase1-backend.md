# Phase 1 Backend Scaffolding

Read PROJECT_CONTEXT.md before starting.

Goal

Create the initial Spring Boot backend for CodeTune.

---

Tasks

1. Create Spring Boot project

Java 17  
Gradle  
Spring Boot 3.x

Dependencies

- spring-boot-starter-web
- spring-boot-starter-validation
- lombok

---

2. Create package structure

com.codetune

common.error

analyze.api
analyze.application
analyze.infra.llm

---

3. Implement API

POST /api/analyze

Controller
AnalyzeController

DTO
AnalyzeRequest
AnalyzeResponse

---

4. Service layer

AnalyzeService

Method

analyze(AnalyzeRequest request)

---

5. LLM Client

Interface

LlmClient

Implementation

OpenAiLlmClient

Responsibilities

- Call OpenAI API
- Return raw LLM response

---

6. Configuration

Read OpenAI API key from

OPENAI_API_KEY

---

7. Return mock result initially

Until PromptBuilder is implemented.

Return example response

{
  "feedbackText": "Example feedback",
  "hint1": "Example hint",
  "refactorExample": "Example refactor"
}

---

8. Verify build

Run

./gradlew build

Ensure project compiles successfully.