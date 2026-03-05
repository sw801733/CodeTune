package com.codetune.analyze.application;

import com.codetune.analyze.api.AnalyzeRequest;
import com.codetune.analyze.api.AnalyzeResponse;
import com.codetune.common.error.LlmParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AnalyzeService {

    private static final String MOCK_LLM_RESPONSE = """
        {
          "feedbackText": "Example feedback",
          "hint1": "Example hint",
          "refactorExample": "Example refactor"
        }
        """;

    private final LlmClient llmClient;
    private final PromptBuilder promptBuilder;
    private final ObjectMapper objectMapper;

    @Value("${codetune.llm.mock-enabled:true}")
    private boolean mockEnabled;

    public AnalyzeResponse analyze(AnalyzeRequest request) {
        String rawResponse = mockEnabled
            ? MOCK_LLM_RESPONSE
            : llmClient.analyze(promptBuilder.build(request));

        return parseAndValidate(rawResponse);
    }

    private AnalyzeResponse parseAndValidate(String rawResponse) {
        try {
            AnalyzeResponse response = objectMapper.readValue(rawResponse, AnalyzeResponse.class);

            if (isBlank(response.getFeedbackText()) || isBlank(response.getHint1()) || isBlank(response.getRefactorExample())) {
                throw new LlmParseException("LLM response is missing required fields: feedbackText, hint1, refactorExample");
            }

            return response;
        } catch (JsonProcessingException ex) {
            throw new LlmParseException("Failed to parse LLM JSON response", ex);
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
