package com.bng.model;

import java.time.LocalDateTime;

public class ChatLog {
    private Long id;
    private String username;
    private String question;
    private String answer;
    private LocalDateTime timestamp;

    public ChatLog() {
    }

    public ChatLog(String username, String question, String answer) {
        this.username = username;
        this.question = question;
        this.answer = answer;
        this.timestamp = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
} 