package com.codetune.common.error;

import lombok.Getter;

@Getter
public abstract class CodeTuneException extends RuntimeException {

    private final ErrorCode errorCode;

    protected CodeTuneException(ErrorCode errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    protected CodeTuneException(ErrorCode errorCode, String message, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }
}
