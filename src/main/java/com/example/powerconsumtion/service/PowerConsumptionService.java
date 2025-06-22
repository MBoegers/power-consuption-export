package com.example.powerconsumtion.service;

import com.example.powerconsumtion.model.PowerConsumptionRecord;
import com.example.powerconsumtion.repository.PowerConsumptionRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PowerConsumptionService {
    private final PowerConsumptionRecordRepository repository;

    public void importCsv(MultipartFile file) throws Exception {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            while ((line = reader.readLine()) != null) {
                if (line.startsWith("timestamp")) continue; // Header überspringen
                String[] parts = line.split(",");
                if (parts.length < 2) continue;
                LocalDateTime timestamp = LocalDateTime.parse(parts[0], formatter);
                double consumption = Double.parseDouble(parts[1]);
                repository.save(new PowerConsumptionRecord(timestamp, consumption));
            }
        }
    }

    public List<PowerConsumptionRecord> getAggregatedRecords(LocalDateTime from, LocalDateTime to) {
        List<PowerConsumptionRecord> records = repository.findByTimestampBetween(from, to);
        // Aggregation auf 30-Minuten-Intervalle
        Map<LocalDateTime, Double> aggregated = new TreeMap<>();
        for (PowerConsumptionRecord rec : records) {
            LocalDateTime rounded = rec.getTimestamp().withMinute(rec.getTimestamp().getMinute() / 30 * 30).withSecond(0).withNano(0);
            aggregated.merge(rounded, rec.getConsumption(), Double::sum);
        }
        return aggregated.entrySet().stream()
                .map(e -> new PowerConsumptionRecord(e.getKey(), e.getValue()))
                .collect(Collectors.toList());
    }

    public String exportToCsv(List<PowerConsumptionRecord> records) {
        StringBuilder sb = new StringBuilder();
        sb.append("timestamp,consumption\n");
        for (PowerConsumptionRecord rec : records) {
            sb.append(rec.getTimestamp()).append(",").append(rec.getConsumption()).append("\n");
        }
        return sb.toString();
    }
}
