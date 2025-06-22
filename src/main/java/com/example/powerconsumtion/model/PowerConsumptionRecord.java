package com.example.powerconsumtion.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
public class PowerConsumptionRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime timestamp;

    private double consumption;

    public PowerConsumptionRecord(LocalDateTime timestamp, double consumption) {
        this.timestamp = timestamp;
        this.consumption = consumption;
    }
}
