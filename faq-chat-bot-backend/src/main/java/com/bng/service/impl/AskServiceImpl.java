package com.bng.service.impl;

import com.bng.model.AskRequest;
import com.bng.model.AskResponse;
import com.bng.model.Faq;
import com.bng.service.AskService;
import com.bng.service.ChatLogService;
import com.bng.service.OpenAiClient;
import com.bng.util.CacheUtil;
import com.bng.util.FaqLoader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AskServiceImpl implements AskService {
    private final Logger logger = LoggerFactory.getLogger(AskServiceImpl.class);
    private final FaqLoader faqLoader;
    private final OpenAiClient openAiClient;
    private final CacheUtil cacheUtil;
    private final ChatLogService chatLogService;

    public AskServiceImpl(FaqLoader faqLoader, OpenAiClient openAiClient, CacheUtil cacheUtil, ChatLogService chatLogService) {
        this.faqLoader = faqLoader;
        this.openAiClient = openAiClient;
        this.cacheUtil = cacheUtil;
        this.chatLogService = chatLogService;
    }

    @Override
    public AskResponse getAnswer(AskRequest request, String username) throws Exception {
        String userQuestion = request.getQuestion().trim();

        // Use a composite key: username::question
        String cacheKey = username + "::" + userQuestion;

        // Check cache first
        String cachedAnswer = cacheUtil.get(cacheKey);
        if (cachedAnswer != null) {
            logger.info("Cache hit for user [{}] and question: {} cachedAnswer:{}", username, userQuestion, cachedAnswer);
            // Log the cached Q&A
            chatLogService.logChat(username, userQuestion, cachedAnswer);
            return new AskResponse(cachedAnswer);
        }

        List<Faq> faqs = faqLoader.getFaqs();
        String systemPrompt = buildSystemPrompt(faqs, username);

        String aiResponse = openAiClient.getAIAnswer(systemPrompt, userQuestion);

        // Check if the response is empty or null
        if (aiResponse == null || aiResponse.isEmpty()) {
            logger.warn("Received empty response from OpenAI API");
            return new AskResponse("Sorry, I couldn't process that request.");
        }

        // Log the Q&A
        logger.info("User: {} | Question: {} | Answer: {}", username, userQuestion, aiResponse);
        
        // Save Q&A with timestamp
        chatLogService.logChat(username, userQuestion, aiResponse);

        // Save in cache
        cacheUtil.put(cacheKey, aiResponse);

        return new AskResponse(aiResponse);
    }

    private String buildSystemPrompt(List<Faq> faqs, String userName) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("You are Lord Krishna, the spiritual guide, speaking directly to the user, who is named ").append(userName).append(".\n");
        prompt.append("The user may ask questions about life, emotions, struggles, or philosophical topics.\n");
        prompt.append("Questions about the Bhagavad Gita itself (what it is, its history, its chapters, etc.) are valid and should be answered thoroughly.\n");
        prompt.append("If the Bhagavad Gita offers relevant teachings or wisdom to help answer the question, answer it respectfully using those teachings.\n");
        prompt.append("When answering, always speak as Krishna, giving the user direct teachings or wisdom from the Bhagavad Gita. Always respond with the tone that Krishna would use in the Gita, offering guidance and insight.\n");
        prompt.append("For questions related to stress, emotions, or philosophical dilemmas, please provide answers based on the Gita's insights.\n");
        prompt.append("If the question is completely unrelated to spiritual topics or the Bhagavad Gita, respond with: 'Please ask something related to the Bhagavad Gita.'\n");
        prompt.append("If the user asks for a specific length response (like '1000 words') that exceeds the system limit, start your response with: 'While I cannot provide 1000 words due to system constraints, I will give you a complete answer within my available limit.' Then proceed with your response.\n");
        prompt.append("Keep your responses concise and under 500 tokens (approximately 350-400 words) unless the user specifically requests a longer answer. Focus on the most important teachings relevant to the question.\n\n");

        prompt.append("Here are some example questions:\n");
        for (int i = 0; i < faqs.size(); i++) {
            prompt.append((i + 1)).append(". ").append(faqs.get(i).getQuestion()).append("\n");
        }

        return prompt.toString();
    }
}
