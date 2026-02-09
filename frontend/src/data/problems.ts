// src/data/problems.ts
import type { Problem } from "../types/problem";

export const problems: Problem[] = [
  {
    id: "int-sign-001",
    topic: "형 변환 / 부호",
    title: "부호가 다른 정수의 조건식",
    code: `#include <stdint.h>

void process(uint16_t len)
{
    int8_t offset = -1;

    if (len + offset > 0)
    {
        /* ... */
    }
}`,
    issue: {
      title: "부호 연산 주의",
      description:
        "부호가 다른 정수 타입이 함께 연산될 경우, 정수 승격과 형 변환으로 인해 조건식의 결과가 의도와 다르게 해석될 수 있습니다.",
      recommendedApproach: [
        "부호가 다른 값이 함께 연산되는지 확인",
        "조건식에서 계산과 비교를 분리하여 의도를 명확히 표현",
      ],
    },
    hint1:
      "조건식 내부에서 덧셈이 수행될 때 각 피연산자의 타입과 부호를 확인해보세요.",
    refactorExample: `int32_t sum = (int32_t)len + (int32_t)offset;
if (sum > 0)
{
    /* ... */
}`,
  },

  {
    id: "int-promo-001",
    topic: "정수 승격",
    title: "작은 정수 타입의 산술 연산",
    code: `#include <stdint.h>

uint8_t calc(uint8_t a, uint8_t b)
{
    return a + b;
}`,
    issue: {
      title: "정수 승격으로 인한 범위 초과 가능성",
      description:
        "작은 정수 타입은 산술 연산 시 더 큰 정수 타입으로 승격되어 계산되며, 결과가 원래 타입의 표현 범위를 초과할 수 있습니다.",
      recommendedApproach: [
        "연산 결과의 최대 범위를 고려",
        "필요 시 중간 계산용 타입을 명확히 지정",
      ],
    },
    hint1:
      "덧셈 연산은 uint8_t 범위에서 수행되지 않을 수 있습니다.",
    refactorExample: `uint16_t tmp = (uint16_t)a + (uint16_t)b;
return (uint8_t)tmp;`,
  },
];