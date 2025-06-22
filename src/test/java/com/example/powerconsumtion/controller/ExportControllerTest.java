package com.example.powerconsumtion.controller;

import com.example.powerconsumtion.service.PowerConsumptionService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import java.time.LocalDateTime;
import java.util.Collections;
import com.example.powerconsumtion.model.PowerConsumptionRecord;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;

@WebMvcTest(ExportController.class)
class ExportControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PowerConsumptionService powerConsumptionService;

    @Test
    void exportCsv_Unauthorized() throws Exception {
        mockMvc.perform(get("/api/export/csv?from=2024-01-01&to=2024-12-31"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser
    void exportCsv_Authorized() throws Exception {
        // Mock das Service-Verhalten, damit keine NullPointerException entsteht
        when(powerConsumptionService.getAggregatedRecords(
                LocalDateTime.parse("2024-01-01T00:00:00"),
                LocalDateTime.parse("2024-12-31T00:00:00")))
            .thenReturn(Collections.singletonList(new PowerConsumptionRecord(LocalDateTime.parse("2024-01-01T00:00:00"), 1.0)));
        when(powerConsumptionService.exportToCsv(org.mockito.ArgumentMatchers.anyList()))
            .thenReturn("timestamp,consumption\n2024-01-01T00:00:00,1.0\n");
        mockMvc.perform(get("/api/export/csv?from=2024-01-01T00:00:00&to=2024-12-31T00:00:00"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser
    void importCsv_Success() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.csv",
                MediaType.TEXT_PLAIN_VALUE,
                ("timestamp,consumption\n2024-01-01 00:00:00,1.0\n").getBytes()
        );
        mockMvc.perform(multipart("/api/export/import/csv").file(file).with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().string("Import erfolgreich"));
    }
}
