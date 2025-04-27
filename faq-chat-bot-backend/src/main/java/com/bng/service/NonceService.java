package com.bng.service;

import com.bng.util.AesEncryptionUtil;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Service
public class NonceService {
    
    // Store recently used nonces with expiration times
    private final Map<String, Long> usedNonces = new ConcurrentHashMap<>();
    
    // Maximum allowed request age in milliseconds (e.g., 5 minutes)
    private final long MAX_REQUEST_AGE_MS = TimeUnit.MINUTES.toMillis(5);
    
    // Minimum time between requests from the same user (rate limiting)
    private final long MIN_REQUEST_INTERVAL_MS = TimeUnit.SECONDS.toMillis(1);
    
    // Map to track last request time per user
    private final Map<String, Long> lastRequestTime = new ConcurrentHashMap<>();
    
    private final AesEncryptionUtil aesEncryptionUtil;
    
    public NonceService(AesEncryptionUtil aesEncryptionUtil) {
        this.aesEncryptionUtil = aesEncryptionUtil;
    }
    
    /**
     * Validates a request based on its timestamp and encrypted nonce
     * 
     * @param username The username making the request
     * @param encryptedNonce An AES-encrypted nonce
     * @param clientTimestamp Client-provided timestamp in milliseconds
     * @return true if request is valid, false otherwise
     */
    public boolean validateRequest(String username, String encryptedNonce, long clientTimestamp) {
        long currentTime = Instant.now().toEpochMilli();
        
        // 1. Check if client timestamp is too old or in the future
        if (clientTimestamp < currentTime - MAX_REQUEST_AGE_MS || clientTimestamp > currentTime + 60000) {
            return false;
        }
        
        // 2. Check if we're being rate-limited (requests too frequent)
        Long lastRequest = lastRequestTime.get(username);
        if (lastRequest != null && currentTime - lastRequest < MIN_REQUEST_INTERVAL_MS) {
            return false;
        }
        
        try {
            // 3. Check if nonce was already used (prevent replay)
            if (usedNonces.containsKey(encryptedNonce)) {
                return false;
            }
            
            // 4. Decrypt nonce - we trust the nonce created by the frontend
            String decryptedNonce = aesEncryptionUtil.decryptNonce(encryptedNonce);
            
            // Store the nonce with expiration time
            usedNonces.put(encryptedNonce, currentTime + MAX_REQUEST_AGE_MS);
            lastRequestTime.put(username, currentTime);
            
            // Cleanup expired nonces (could be moved to a scheduled task for better performance)
            cleanupExpiredNonces();
            
            return true;
        } catch (Exception e) {
            // If there's any error in decryption, consider it invalid
            return false;
        }
    }
    
    private void cleanupExpiredNonces() {
        long currentTime = Instant.now().toEpochMilli();
        usedNonces.entrySet().removeIf(entry -> entry.getValue() < currentTime);
    }
} 