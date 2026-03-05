package com.codetune.common.error;

public class OpenAiRateLimitException extends CodeTuneException {

    public OpenAiRateLimitException(String message) {
        super(ErrorCode.OPENAI_RATE_LIMIT, message);
    }

    public OpenAiRateLimitException(String message, Throwable cause) {
        super(ErrorCode.OPENAI_RATE_LIMIT, message, cause);
    }
}
