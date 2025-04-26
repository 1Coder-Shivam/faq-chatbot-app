package com.bng.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = EnglishLanguageValidator.class)
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface EnglishLanguage {
    String message() default "Question must be primarily in English language";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
