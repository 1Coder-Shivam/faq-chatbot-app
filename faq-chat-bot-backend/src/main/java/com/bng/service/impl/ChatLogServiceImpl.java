package com.bng.service.impl;

import com.bng.model.ChatLog;
import com.bng.service.ChatLogService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class ChatLogServiceImpl implements ChatLogService {
    private static final Logger logger = LoggerFactory.getLogger(ChatLogServiceImpl.class);
    private static final String LOG_DIR = "logs";
    private static final String LOG_FILE_PREFIX = "chat_logs_";
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    
    private final Gson gson;
    
    public ChatLogServiceImpl() {
        this.gson = new GsonBuilder()
                .setPrettyPrinting()
                .registerTypeAdapter(LocalDateTime.class, new LocalDateTimeAdapter())
                .create();
        
        // Ensure logs directory exists
        try {
            Path logsDir = Paths.get(LOG_DIR);
            if (!Files.exists(logsDir)) {
                Files.createDirectories(logsDir);
                logger.info("Created logs directory: {}", logsDir.toAbsolutePath());
            }
        } catch (IOException e) {
            logger.error("Failed to create logs directory", e);
        }
    }
    
    @Override
    public void logChat(String username, String question, String answer) {
        ChatLog chatLog = createChatLog(username, question, answer);
        saveLogToFile(chatLog);
    }
    
    @Override
    public ChatLog createChatLog(String username, String question, String answer) {
        return new ChatLog(username, question, answer);
    }
    
    private void saveLogToFile(ChatLog chatLog) {
        String today = chatLog.getTimestamp().format(DATE_FORMATTER);
        String filename = LOG_FILE_PREFIX + today + ".json";
        File logFile = new File(LOG_DIR, filename);
        
        try {
            // Read existing logs or create new array
            String jsonContent;
            if (logFile.exists() && logFile.length() > 0) {
                jsonContent = Files.readString(logFile.toPath());
                
                // Handle malformed JSON case - if it ends with ],
                if (jsonContent.endsWith("],")) {
                    jsonContent = jsonContent.substring(0, jsonContent.length() - 1);
                }
                
                // If the file doesn't start with [ or doesn't end with ], adjust it
                if (!jsonContent.startsWith("[")) {
                    jsonContent = "[" + jsonContent;
                }
                if (!jsonContent.endsWith("]")) {
                    // If it ends with comma, keep it, otherwise add one
                    if (!jsonContent.endsWith(",")) {
                        jsonContent += ",";
                    }
                } else {
                    // If it ends with ], remove the ] to add more entries
                    jsonContent = jsonContent.substring(0, jsonContent.length() - 1);
                    if (!jsonContent.endsWith(",")) {
                        jsonContent += ",";
                    }
                }
                
                // Append the new entry and close the array
                jsonContent += gson.toJson(chatLog) + "]";
            } else {
                // New file, create a fresh JSON array with one entry
                jsonContent = "[" + gson.toJson(chatLog) + "]";
            }
            
            // Write the complete updated JSON back to file
            Files.writeString(logFile.toPath(), jsonContent);
            logger.info("Logged chat for user [{}] to file: {}", chatLog.getUsername(), logFile.getAbsolutePath());
            
        } catch (IOException e) {
            logger.error("Failed to log chat to file", e);
        }
    }
    
    // Adapter for serializing LocalDateTime
    private static class LocalDateTimeAdapter implements com.google.gson.JsonSerializer<LocalDateTime> {
        @Override
        public com.google.gson.JsonElement serialize(LocalDateTime src, java.lang.reflect.Type typeOfSrc, com.google.gson.JsonSerializationContext context) {
            return new com.google.gson.JsonPrimitive(src.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        }
    }
} 