package com.finance_tracker.repository;

import com.finance_tracker.model.Investment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvestmentRepository extends JpaRepository<Investment, Long> {
    List<Investment> findByType(String type);
    List<Investment> findBySymbol(String symbol);
}
