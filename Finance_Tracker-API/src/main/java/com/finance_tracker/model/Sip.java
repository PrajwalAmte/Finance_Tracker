package com.finance_tracker.model;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "sips")
public class Sip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String schemeCode;
    private BigDecimal monthlyAmount;
    private LocalDate startDate;
    private Integer durationMonths;
    private BigDecimal currentNav;
    private BigDecimal totalUnits;
    private LocalDate lastUpdated;
    private LocalDate lastInvestmentDate;

    // Helper methods
    public BigDecimal getCurrentValue() {
        return totalUnits.multiply(currentNav);
    }

    public Integer getCompletedInstallments() {
        if (startDate == null) {
            return 0;
        }

        // If lastInvestmentDate is null, calculate based on current date instead
        LocalDate endDate = lastInvestmentDate != null ? lastInvestmentDate : LocalDate.now();

        // If the start date is in the future, return 0
        if (startDate.isAfter(endDate)) {
            return 0;
        }

        return (int) (startDate.until(endDate).toTotalMonths() + 1);
    }

    public BigDecimal getTotalInvested() {
        return monthlyAmount.multiply(new BigDecimal(getCompletedInstallments()));
    }

    public BigDecimal getProfitLoss() {
        return getCurrentValue().subtract(getTotalInvested());
    }
}
