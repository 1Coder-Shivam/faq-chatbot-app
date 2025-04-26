package com.bng.service;

import com.bng.model.AskRequest;
import com.bng.model.AskResponse;

public interface AskService {
    AskResponse getAnswer(AskRequest request, String username) throws Exception;
}
