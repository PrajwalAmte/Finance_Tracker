package com.finance_tracker.model;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "investments")
public class Investment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String symbol;
    private String type; // STOCK, MUTUAL_FUND, etc.
    private BigDecimal quantity;
    private BigDecimal purchasePrice;
    private BigDecimal currentPrice;
    private LocalDate purchaseDate;
    private LocalDate lastUpdated;

    // Helper methods
    public BigDecimal getCurrentValue() {
        return quantity.multiply(currentPrice);
    }

    public BigDecimal getProfitLoss() {
        BigDecimal costBasis = quantity.multiply(purchasePrice);
        return getCurrentValue().subtract(costBasis);
    }

    public BigDecimal getReturnPercentage() {
        BigDecimal costBasis = quantity.multiply(purchasePrice);
        if (costBasis.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        return getProfitLoss().multiply(new BigDecimal("100")).divide(costBasis, 2, BigDecimal.ROUND_HALF_UP);
    }
}
