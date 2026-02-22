// src/data/problems.ts
import type { Problem } from "../types/problem";

export const problems: Problem[] = [
  {
    id: "int-sign-001",
    topic: "형 변환/부호",
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
      title: "부호 혼합 연산으로 조건식 왜곡 가능",
      description:
        "부호가 다른 정수 타입이 함께 연산되면 정수 승격/형 변환 과정에서 의도와 다른 값으로 비교될 수 있습니다. 특히 조건식 내부에서 연산과 비교가 함께 있을 때 문제를 놓치기 쉽습니다.",
      recommendedApproach: [
        "조건식 내부의 연산을 중간 변수로 분리해 타입을 명확히 하기",
        "비교는 동일한 부호/폭의 타입으로 맞춰서 수행하기",
      ],
    },
    hint1:
      "len과 offset이 같은 부호/폭이 아니면, 연산 결과가 어떤 타입으로 계산되는지부터 확인하세요.",
    refactorExample: `#include <stdint.h>

void process(uint16_t len)
{
    int8_t offset = -1;

    int32_t sum = (int32_t)len + (int32_t)offset;
    if (sum > 0)
    {
        /* ... */
    }
}`,
  },

  {
    id: "int-promo-001",
    topic: "정수 승격/범위",
    title: "작은 정수 타입 덧셈의 범위 초과",
    code: `#include <stdint.h>

uint8_t add_u8(uint8_t a, uint8_t b)
{
    return (uint8_t)(a + b);
}`,
    issue: {
      title: "연산 결과가 원래 타입 범위를 초과할 수 있음",
      description:
        "작은 정수 타입은 산술 연산 시 더 큰 정수 타입으로 승격되어 계산됩니다. 결과가 0~255 범위를 초과할 수 있는데, 단순 캐스팅으로 잘라내면 의도하지 않은 값이 될 수 있습니다.",
      recommendedApproach: [
        "중간 계산은 충분히 큰 타입으로 수행하고 결과 범위를 검토하기",
        "필요하다면 포화(saturate) 또는 범위 체크 후 반환하기",
      ],
    },
    hint1:
      "a=200, b=100 같은 케이스를 넣으면 어떤 값이 나올지 먼저 계산해보세요.",
    refactorExample: `#include <stdint.h>
#include <stdbool.h>

bool add_u8_checked(uint8_t a, uint8_t b, uint8_t* out)
{
    uint16_t tmp = (uint16_t)a + (uint16_t)b;
    if (tmp > 255u) {
        return false;
    }
    *out = (uint8_t)tmp;
    return true;
}`,
  },

  {
    id: "shift-001",
    topic: "시프트/비트",
    title: "시프트 폭이 타입 폭 이상일 수 있음",
    code: `#include <stdint.h>

uint32_t bit_mask(uint8_t pos)
{
    return (1u << pos);
}`,
    issue: {
      title: "시프트 연산의 유효 범위 미확인",
      description:
        "시프트 연산은 시프트 폭이 대상 타입의 비트 폭 이상이 되면 결과가 비정상적이거나 플랫폼 의존 동작이 될 수 있습니다. 입력(pos)이 외부에서 온다면 특히 위험합니다.",
      recommendedApproach: [
        "시프트 폭(pos)의 허용 범위를 명확히 제한하기",
        "필요 시 상수 폭(예: 32)과 비교해 방어 조건을 추가하기",
      ],
    },
    hint1:
      "pos가 32 이상이면 어떻게 될까요? 입력 범위를 강제할 방법을 생각해보세요.",
    refactorExample: `#include <stdint.h>

uint32_t bit_mask(uint8_t pos)
{
    if (pos >= 32u) {
        return 0u;
    }
    return (1u << pos);
}`,
  },

  {
    id: "ptr-bound-001",
    topic: "포인터/경계",
    title: "배열 길이보다 큰 인덱스 접근 가능",
    code: `#include <stdint.h>

uint8_t read_at(const uint8_t* buf, uint16_t len, uint16_t idx)
{
    return buf[idx];
}`,
    issue: {
      title: "경계 체크 없는 배열 접근",
      description:
        "idx가 len 범위를 벗어나면 범위를 벗어난 메모리를 읽게 됩니다. 입력이 외부에서 오거나 상위 로직에서 보장되지 않는다면 결함으로 이어질 수 있습니다.",
      recommendedApproach: [
        "인덱스 접근 전 len/idx 범위를 확인하기",
        "실패 시 기본값 반환 또는 상태 코드를 통해 호출자에게 알리기",
      ],
    },
    hint1:
      "idx가 len과 같거나 더 크면 어떤 문제가 생길까요? 실패를 표현할 방법도 같이 고민해보세요.",
    refactorExample: `#include <stdint.h>
#include <stdbool.h>

bool read_at_checked(const uint8_t* buf, uint16_t len, uint16_t idx, uint8_t* out)
{
    if ((buf == 0) || (out == 0)) {
        return false;
    }
    if (idx >= len) {
        return false;
    }
    *out = buf[idx];
    return true;
}`,
  },

  {
    id: "defensive-001",
    topic: "널/방어 코드",
    title: "NULL 포인터 입력 처리 누락",
    code: `#include <stdint.h>

uint32_t sum_u16(const uint16_t* a, uint16_t n)
{
    uint32_t sum = 0u;
    for (uint16_t i = 0u; i < n; ++i)
    {
        sum += a[i];
    }
    return sum;
}`,
    issue: {
      title: "포인터 입력의 유효성 미검증",
      description:
        "포인터 인자가 NULL일 수 있는 환경이라면, 역참조 시 즉시 오류가 발생합니다. 또한 n이 비정상적으로 큰 경우 성능/시간 측면에서도 문제가 될 수 있습니다.",
      recommendedApproach: [
        "포인터/길이 입력의 최소 유효성(널/0)부터 확인하기",
        "호출자가 기대하는 실패 처리 방식(0 반환/상태코드)을 명확히 하기",
      ],
    },
    hint1:
      "a가 NULL이고 n이 0이 아닐 때 어떻게 될까요? 함수가 실패를 표현하는 형태도 고려해보세요.",
    refactorExample: `#include <stdint.h>
#include <stdbool.h>

bool sum_u16_checked(const uint16_t* a, uint16_t n, uint32_t* out)
{
    if ((a == 0) || (out == 0)) {
        return false;
    }

    uint32_t sum = 0u;
    for (uint16_t i = 0u; i < n; ++i)
    {
        sum += (uint32_t)a[i];
    }

    *out = sum;
    return true;
}`,
  },
];