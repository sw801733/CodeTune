package com.codetune.analyze.application;

import com.codetune.analyze.api.AnalyzeRequest;
import org.springframework.stereotype.Component;

@Component
public class PromptBuilder {

    public String build(AnalyzeRequest request) {
        return """
            You are a coding tutor. Return only JSON with fields: feedbackText, hint1, refactorExample.
            problemId: %s
            attemptWrong: %d
            code:
            %s
            """.formatted(request.getProblemId(), request.getAttemptWrong(), request.getCode());
    }
}
