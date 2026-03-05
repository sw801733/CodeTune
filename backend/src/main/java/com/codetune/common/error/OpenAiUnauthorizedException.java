package com.codetune.common.error;

public class OpenAiUnauthorizedException extends CodeTuneException {

    public OpenAiUnauthorizedException(String message) {
        super(ErrorCode.OPENAI_UNAUTHORIZED, message);
    }

    public OpenAiUnauthorizedException(String message, Throwable cause) {
        super(ErrorCode.OPENAI_UNAUTHORIZED, message, cause);
    }
}
