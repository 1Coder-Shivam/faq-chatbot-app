package com.bng.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Component
public class AesEncryptionUtil {

    @Value("${nonce.encryption.key}")
    private String encryptionKey;
    
    private static final String ALGORITHM = "AES/CBC/PKCS5Padding";
    
    /**
     * Decrypts a nonce received from the client
     * 
     * @param encryptedNonce The encrypted nonce from X-Nonce header
     * @return The decrypted nonce content
     */
    public String decryptNonce(String encryptedNonce) {
        try {
            return decrypt(encryptedNonce);
        } catch (Exception e) {
            throw new RuntimeException("Error decrypting nonce", e);
        }
    }
    
    /**
     * Decrypts ciphertext using AES encryption
     */
    private String decrypt(String ciphertext) throws Exception {
        byte[] keyBytes = encryptionKey.getBytes(StandardCharsets.UTF_8);
        SecretKeySpec secretKey = new SecretKeySpec(keyBytes, "AES");
        
        // Extract IV and ciphertext
        byte[] encryptedIvTextBytes = Base64.getDecoder().decode(ciphertext);
        byte[] iv = new byte[16];
        byte[] encryptedBytes = new byte[encryptedIvTextBytes.length - 16];
        
        System.arraycopy(encryptedIvTextBytes, 0, iv, 0, iv.length);
        System.arraycopy(encryptedIvTextBytes, 16, encryptedBytes, 0, encryptedBytes.length);
        
        // Decrypt
        Cipher cipher = Cipher.getInstance(ALGORITHM);
        cipher.init(Cipher.DECRYPT_MODE, secretKey, new IvParameterSpec(iv));
        byte[] decrypted = cipher.doFinal(encryptedBytes);
        
        return new String(decrypted, StandardCharsets.UTF_8);
    }
} 