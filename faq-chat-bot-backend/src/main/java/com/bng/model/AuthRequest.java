package com.bng.model;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AuthRequest {
    
    @NotBlank(message = "Username cannot be blank")
    private String username;
} 