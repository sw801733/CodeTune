package com.codetune.analyze.api;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AnalyzeRequest {

    @NotBlank(message = "problemId is required")
    private String problemId;

    @NotBlank(message = "code is required")
    private String code;

    @NotNull(message = "attemptWrong is required")
    @Min(value = 0, message = "attemptWrong must be greater than or equal to 0")
    private Integer attemptWrong;
}
