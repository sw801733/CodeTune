package com.codetune.common.error;

import java.time.Instant;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CodeTuneException.class)
    public ResponseEntity<ErrorResponse> handleCodeTuneException(CodeTuneException ex) {
        HttpStatus status = switch (ex.getErrorCode()) {
            case OPENAI_UNAUTHORIZED -> HttpStatus.UNAUTHORIZED;
            case OPENAI_RATE_LIMIT -> HttpStatus.TOO_MANY_REQUESTS;
            case OPENAI_TIMEOUT -> HttpStatus.GATEWAY_TIMEOUT;
            case LLM_PARSE_ERROR -> HttpStatus.BAD_GATEWAY;
            default -> HttpStatus.INTERNAL_SERVER_ERROR;
        };

        return ResponseEntity.status(status)
            .body(new ErrorResponse(ex.getErrorCode().name(), ex.getMessage(), Instant.now()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .findFirst()
            .map(FieldError::getDefaultMessage)
            .orElse("Invalid request");

        return ResponseEntity.badRequest()
            .body(new ErrorResponse(ErrorCode.BAD_REQUEST.name(), message, Instant.now()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleUnexpected(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(new ErrorResponse(ErrorCode.INTERNAL_SERVER_ERROR.name(), "Internal server error", Instant.now()));
    }
}
