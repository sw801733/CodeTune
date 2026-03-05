package com.codetune.common.error;

public class LlmParseException extends CodeTuneException {

    public LlmParseException(String message) {
        super(ErrorCode.LLM_PARSE_ERROR, message);
    }

    public LlmParseException(String message, Throwable cause) {
        super(ErrorCode.LLM_PARSE_ERROR, message, cause);
    }
}
