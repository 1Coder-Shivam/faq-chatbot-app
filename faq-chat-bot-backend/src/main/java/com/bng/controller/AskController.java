package com.bng.controller;

import com.bng.model.AskRequest;
import com.bng.model.AskResponse;
import com.bng.model.ErrorResponse;
import com.bng.service.AskService;
import jakarta.validation.Valid;
import com.google.gson.Gson;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AskController {

    private final AskService askService;
    private final Gson gson = new Gson();

    public AskController(AskService askService) {
        this.askService = askService;
    }

    @PostMapping("/ask")
    public ResponseEntity<?> ask(
            @RequestParam(name = "username", required = false) String username,
            @Valid @RequestBody AskRequest request) throws Exception {
        // Validate username length
        if (username == null || username.trim().isEmpty() || username.length() < 3 || username.length() > 15) {
            ErrorResponse error = new ErrorResponse("Username must be between 3 and 15 characters");
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(gson.toJson(error));
        }
        
        // Get authenticated username from JWT token
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String authenticatedUsername = authentication.getName();
        
        // Check if username in request matches the one in JWT token
        if (!username.equals(authenticatedUsername)) {
            ErrorResponse error = new ErrorResponse("Username in request does not match authenticated user");
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(gson.toJson(error));
        }
        
        AskResponse response = askService.getAnswer(request, username);
        return ResponseEntity.ok(response);
    }
}
