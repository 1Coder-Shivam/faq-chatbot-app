package com.bng.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class EnglishLanguageValidator implements ConstraintValidator<EnglishLanguage, String> {

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) {
            return true; // @NotBlank will handle null/empty separately
        }

        // Allowable pattern: English letters, numbers, and common punctuation
        String allowedPattern = "^[a-zA-Z0-9\\s.,?!'\"()\\-_:;@#&$%]*$";

        // Check if input matches allowed characters
        if (!value.matches(allowedPattern)) {
            return false;
        }

        // Extra: Count English vs Non-English characters
        long totalLetters = value.chars()
                .filter(Character::isLetter)
                .count();

        long nonEnglishLetters = value.chars()
                .filter(c -> Character.isLetter(c) && !(c >= 'A' && c <= 'Z') && !(c >= 'a' && c <= 'z'))
                .count();

        if (totalLetters == 0) {
            return false; // No letters at all
        }

        double nonEnglishRatio = (double) nonEnglishLetters / totalLetters;

        return nonEnglishRatio <= 0.2; // Allow small mistake (up to 20% non-English chars)
    }
}
