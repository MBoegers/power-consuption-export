package com.example.powerconsumtion.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final String SECRET = "testtesttesttesttesttesttesttest";
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Testnutzer (in echt aus DB holen!)
    private final String testUser = "user";
    private final String testPasswordHash = "$2a$12$1VSPihiInQ06uyFolrJwyutEUjx69IwPR0Uoj0C/KXL49rHcFr5Uq"; // Passwort: password

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String username = loginData.get("username");
        String password = loginData.get("password");
        if (testUser.equals(username) && passwordEncoder.matches(password, testPasswordHash)) {
            String token = Jwts.builder()
                    .setSubject(username)
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1 Tag
                    .signWith(SignatureAlgorithm.HS256, SECRET.getBytes())
                    .compact();
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }
}
