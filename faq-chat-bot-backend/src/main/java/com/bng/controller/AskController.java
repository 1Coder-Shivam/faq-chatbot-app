package com.bng.controller;

import com.bng.model.AskRequest;
import com.bng.model.AskResponse;
import com.bng.model.ErrorResponse;
import com.bng.service.AskService;
import jakarta.validation.Valid;
import com.google.gson.Gson;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
        if (username == null || username.trim().isEmpty()) {
            ErrorResponse error = new ErrorResponse("Username must not be null or blank");
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(gson.toJson(error));
        }
        AskResponse response = askService.getAnswer(request, username);
        return ResponseEntity.ok(response);
    }
}
