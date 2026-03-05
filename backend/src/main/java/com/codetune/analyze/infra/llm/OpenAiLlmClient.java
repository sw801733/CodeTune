package com.codetune.analyze.infra.llm;

import com.codetune.analyze.application.LlmClient;
import com.codetune.common.error.LlmParseException;
import com.codetune.common.error.OpenAiRateLimitException;
import com.codetune.common.error.OpenAiTimeoutException;
import com.codetune.common.error.OpenAiUnauthorizedException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

@Component
@RequiredArgsConstructor
public class OpenAiLlmClient implements LlmClient {

    private static final String CHAT_COMPLETIONS_PATH = "/v1/chat/completions";

    private final OpenAiProperties properties;

    @Setter
    @Value("${OPENAI_API_KEY:}")
    private String openAiApiKey;

    @Override
    public String analyze(String prompt) {
        if (openAiApiKey == null || openAiApiKey.isBlank()) {
            throw new OpenAiUnauthorizedException("OPENAI_API_KEY is missing");
        }

        ChatCompletionRequest request = ChatCompletionRequest.of(properties.getModel(), prompt);

        try {
            ChatCompletionResponse response = createRestClient()
                .post()
                .uri(CHAT_COMPLETIONS_PATH)
                .contentType(MediaType.APPLICATION_JSON)
                .body(request)
                .retrieve()
                .body(ChatCompletionResponse.class);

            return extractContent(response);
        } catch (HttpClientErrorException.Unauthorized ex) {
            throw new OpenAiUnauthorizedException("OpenAI request unauthorized", ex);
        } catch (HttpClientErrorException.TooManyRequests ex) {
            throw new OpenAiRateLimitException("OpenAI rate limit exceeded", ex);
        } catch (ResourceAccessException ex) {
            throw new OpenAiTimeoutException("OpenAI request timed out", ex);
        } catch (RestClientResponseException ex) {
            if (ex.getStatusCode().value() == 401) {
                throw new OpenAiUnauthorizedException("OpenAI request unauthorized", ex);
            }
            if (ex.getStatusCode().value() == 429) {
                throw new OpenAiRateLimitException("OpenAI rate limit exceeded", ex);
            }
            throw ex;
        }
    }

    private RestClient createRestClient() {
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(properties.getTimeoutMillis());
        requestFactory.setReadTimeout(properties.getTimeoutMillis());

        return RestClient.builder()
            .baseUrl(properties.getBaseUrl())
            .requestFactory(requestFactory)
            .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + openAiApiKey)
            .build();
    }

    private String extractContent(ChatCompletionResponse response) {
        if (response == null
            || response.choices() == null
            || response.choices().isEmpty()
            || response.choices().get(0).message() == null
            || response.choices().get(0).message().content() == null
            || response.choices().get(0).message().content().isBlank()) {
            throw new LlmParseException("OpenAI response did not contain message content");
        }

        return response.choices().get(0).message().content();
    }

    private record ChatCompletionRequest(String model, List<ChatMessage> messages, double temperature) {

        static ChatCompletionRequest of(String model, String prompt) {
            return new ChatCompletionRequest(
                model,
                List.of(
                    new ChatMessage("system", "You must return JSON only."),
                    new ChatMessage("user", prompt)
                ),
                0.2
            );
        }
    }

    private record ChatMessage(String role, String content) {
    }

    private record ChatCompletionResponse(List<Choice> choices) {
    }

    private record Choice(Message message) {
    }

    private record Message(String content) {
    }
}
