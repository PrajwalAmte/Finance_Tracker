package com.finance_tracker.model;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Data
@Entity
@Table(name = "loans")
public class Loan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private BigDecimal principalAmount;
    private BigDecimal interestRate; // Annual interest rate (in percentage)
    private String interestType; // SIMPLE, COMPOUND
    private String compoundingFrequency; // MONTHLY, QUARTERLY, YEARLY (for compound interest)
    private LocalDate startDate;
    private Integer tenureMonths;
    private BigDecimal emiAmount;
    private BigDecimal currentBalance;
    private LocalDate lastUpdated;

    // Helper methods
    public LocalDate getEndDate() {
        if (startDate == null || tenureMonths == null) {
            return null;
        }
        return startDate.plusMonths(tenureMonths);
    }

    public Integer getRemainingMonths() {
        if (getEndDate() == null) {
            return null;
        }
        LocalDate today = LocalDate.now();
        return (int) today.until(getEndDate(), ChronoUnit.MONTHS);
    }

    public BigDecimal getTotalRepayment() {
        if (emiAmount == null || tenureMonths == null) {
            return null;
        }
        return emiAmount.multiply(new BigDecimal(tenureMonths));
    }

    public BigDecimal getTotalInterest() {
        BigDecimal totalRepayment = getTotalRepayment();
        if (totalRepayment == null || principalAmount == null) {
            return null;
        }
        return totalRepayment.subtract(principalAmount);
    }
}
