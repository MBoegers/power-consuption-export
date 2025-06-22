package com.example.powerconsumtion.config;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;

@TestConfiguration
public class TestSecurityConfig {
    @Bean
    public JwtDecoder jwtDecoder() {
        // Dummy Decoder, akzeptiert jeden Token (Secret: 32 Zeichen)
        return NimbusJwtDecoder.withSecretKey(new javax.crypto.spec.SecretKeySpec("testtesttesttesttesttesttesttest".getBytes(), "HmacSHA256")).build();
    }
}
