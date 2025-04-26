package com.bng.util;

import com.bng.model.Faq;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;

@Component
public class FaqLoader {
    private List<Faq> faqs;

    @PostConstruct
    public void init() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        faqs = mapper.readValue(new ClassPathResource("faqs.json").getInputStream(), new TypeReference<List<Faq>>() {});
    }

    public List<Faq> getFaqs() {
        return faqs;
    }
}
