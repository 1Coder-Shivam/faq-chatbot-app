package com.bng.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;


public class AskRequest {
    @NotBlank(message = "Question must not be blank")
    @Size(max = 100, message = "Question must not exceed 100 characters")
    private String question;

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }
}
