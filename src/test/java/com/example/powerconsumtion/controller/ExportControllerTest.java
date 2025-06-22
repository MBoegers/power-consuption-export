package com.example.powerconsumtion.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ExportController.class)
class ExportControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void exportCsv_Unauthorized() throws Exception {
        mockMvc.perform(get("/api/export/csv?from=2024-01-01&to=2024-12-31"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser
    void exportCsv_Authorized() throws Exception {
        mockMvc.perform(get("/api/export/csv?from=2024-01-01&to=2024-12-31"))
                .andExpect(status().isOk());
    }
}

