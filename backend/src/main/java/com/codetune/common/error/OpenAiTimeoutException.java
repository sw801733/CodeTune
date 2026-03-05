package com.codetune.common.error;

public class OpenAiTimeoutException extends CodeTuneException {

    public OpenAiTimeoutException(String message) {
        super(ErrorCode.OPENAI_TIMEOUT, message);
    }

    public OpenAiTimeoutException(String message, Throwable cause) {
        super(ErrorCode.OPENAI_TIMEOUT, message, cause);
    }
}
