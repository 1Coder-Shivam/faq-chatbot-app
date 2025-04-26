package com.bng.exception;

import com.bng.model.ErrorResponse;
import com.google.gson.Gson;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.validation.FieldError;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private final Gson gson = new Gson();

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<String> handleValidationException(MethodArgumentNotValidException ex) {
        FieldError fieldError = ex.getBindingResult().getFieldError();
        if (fieldError != null) {
            ErrorResponse errorResponse = new ErrorResponse(fieldError.getDefaultMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(gson.toJson(errorResponse));
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(gson.toJson(new ErrorResponse("Invalid input")));
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<String> handleConstraintViolationException(ConstraintViolationException ex) {
        ErrorResponse errorResponse = new ErrorResponse(ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(gson.toJson(errorResponse));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGeneralException(Exception ex) {
        ErrorResponse errorResponse = new ErrorResponse("An unexpected error occurred: " + ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(gson.toJson(errorResponse));
    }
}

