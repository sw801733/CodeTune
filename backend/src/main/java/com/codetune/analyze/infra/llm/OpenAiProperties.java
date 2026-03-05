package com.codetune.analyze.infra.llm;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "codetune.llm.openai")
public class OpenAiProperties {

    private String baseUrl = "https://api.openai.com";
    private String model = "gpt-4.1-mini";
    private int timeoutMillis = 5000;
}
