package com.example.powerconsumtion.controller;

import com.example.powerconsumtion.repository.PowerConsumptionRecordRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class ExportControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private PowerConsumptionRecordRepository repository;

    private String generateTestJwt() {
        String secret = "testtesttesttesttesttesttesttest";
        return Jwts.builder()
                .setSubject("testuser")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 3600_000))
                .signWith(SignatureAlgorithm.HS256, secret.getBytes())
                .compact();
    }

    @Test
    void importAndExportCsv_FullIntegration() throws Exception {
        String jwt = generateTestJwt();
        String csv = "timestamp,consumption\n2024-01-01 00:00:00,1.0\n2024-01-01 00:15:00,2.0\n2024-01-01 00:30:00,3.0\n";
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.csv",
                MediaType.TEXT_PLAIN_VALUE,
                csv.getBytes()
        );
        mockMvc.perform(multipart("/api/export/import/csv").file(file)
                .header("Authorization", "Bearer " + jwt))
                .andExpect(status().isOk())
                .andExpect(content().string("Import erfolgreich"));

        // 2. Überprüfe, dass die Daten in der DB sind
        assertThat(repository.count()).isEqualTo(3);
        assertThat(repository.findByTimestampBetween(
                LocalDateTime.parse("2024-01-01T00:00:00"),
                LocalDateTime.parse("2024-01-01T00:45:00"))).hasSize(3);

        // 3. Exportiere die Daten aggregiert als CSV (30-Minuten-Intervalle)
        String expectedCsv = "timestamp,consumption\n2024-01-01T00:00,3.0\n2024-01-01T00:30,3.0\n";
        mockMvc.perform(get("/api/export/csv?from=2024-01-01T00:00:00&to=2024-01-01T01:00:00")
                .header("Authorization", "Bearer " + jwt))
                .andExpect(status().isOk())
                .andExpect(content().string(expectedCsv));
    }
}
