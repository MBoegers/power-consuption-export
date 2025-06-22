package com.example.powerconsumtion.controller;

import com.example.powerconsumtion.service.PowerConsumptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/export")
public class ExportController {
    @Autowired
    private PowerConsumptionService powerConsumptionService;

    @PostMapping("/import/csv")
    public ResponseEntity<String> importCsv(@RequestPart("file") MultipartFile file) {
        try {
            powerConsumptionService.importCsv(file);
            return ResponseEntity.ok("Import erfolgreich");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Fehler beim Import: " + e.getMessage());
        }
    }

    @GetMapping("/csv")
    public ResponseEntity<String> exportCsv(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
                                            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
                                            @AuthenticationPrincipal Jwt jwt) {
        var records = powerConsumptionService.getAggregatedRecords(from, to);
        String csv = powerConsumptionService.exportToCsv(records);
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=export.csv")
                .body(csv);
    }

    @GetMapping("/json")
    public ResponseEntity<?> exportJson(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
                                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
                                        @AuthenticationPrincipal Jwt jwt) {
        var records = powerConsumptionService.getAggregatedRecords(from, to);
        return ResponseEntity.ok(records);
    }
}
