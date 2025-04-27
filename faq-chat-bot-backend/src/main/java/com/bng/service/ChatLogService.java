package com.bng.service;

import com.bng.model.ChatLog;

public interface ChatLogService {
    void logChat(String username, String question, String answer);
    ChatLog createChatLog(String username, String question, String answer);
} 