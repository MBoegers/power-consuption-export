package com.example.powerconsumtion.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .authorizeRequests()
                .antMatchers("/api/export/**").authenticated()
                .anyRequest().permitAll()
            .and()
            .oauth2ResourceServer()
                .jwt();
        return http.build();
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        // Symmetrischer Key für lokale JWT-Validierung (mind. 256 Bit)
        String secret = "testtesttesttesttesttesttesttest";
        return NimbusJwtDecoder.withSecretKey(new javax.crypto.spec.SecretKeySpec(secret.getBytes(), "HmacSHA256")).build();
    }
}
