package com.example.powerconsumtion.repository;

import com.example.powerconsumtion.model.PowerConsumptionRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PowerConsumptionRecordRepository extends JpaRepository<PowerConsumptionRecord, Long> {
    List<PowerConsumptionRecord> findByTimestampBetween(LocalDateTime from, LocalDateTime to);
}

