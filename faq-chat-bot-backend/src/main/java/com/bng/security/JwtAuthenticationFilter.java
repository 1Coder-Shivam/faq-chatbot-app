package com.bng.security;

import com.bng.model.ErrorResponse;
import com.bng.service.NonceService;
import com.bng.util.JwtUtil;
import com.google.gson.Gson;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final NonceService nonceService;
    private final Gson gson = new Gson();

    public JwtAuthenticationFilter(JwtUtil jwtUtil, NonceService nonceService) {
        this.jwtUtil = jwtUtil;
        this.nonceService = nonceService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        // Skip nonce check for token endpoint
        if (request.getRequestURI().equals("/api/auth/token") && request.getMethod().equals("POST")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String authorizationHeader = request.getHeader("Authorization");
        final String nonceHeader = request.getHeader("X-Nonce");
        final String timestampHeader = request.getHeader("X-Timestamp");

        String username = null;
        String jwt = null;

        // Validate that required headers are present
        if (nonceHeader == null || timestampHeader == null) {
            sendError(response, "Missing required security headers (X-Nonce, X-Timestamp)");
            return;
        }

        // Parse timestamp
        long timestamp;
        try {
            timestamp = Long.parseLong(timestampHeader);
        } catch (NumberFormatException e) {
            sendError(response, "Invalid timestamp format");
            return;
        }

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            try {
                username = jwtUtil.extractUsername(jwt);
            } catch (Exception e) {
                logger.error("Error extracting username from token", e);
            }
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            if (jwtUtil.validateToken(jwt)) {
                // Validate nonce and timestamp to prevent replay attacks
                if (!nonceService.validateRequest(username, nonceHeader, timestamp)) {
                    sendError(response, "Invalid request: Possible replay attack detected");
                    return;
                }

                UsernamePasswordAuthenticationToken authenticationToken =
                        new UsernamePasswordAuthenticationToken(username, null, new ArrayList<>());
                
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
        }

        filterChain.doFilter(request, response);
    }

    private void sendError(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType("application/json");
        
        ErrorResponse errorResponse = new ErrorResponse(message);
        response.getWriter().write(gson.toJson(errorResponse));
    }
} 