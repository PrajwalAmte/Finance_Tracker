package com.finance_tracker.controller;

import com.finance_tracker.service.InvestmentService;
import com.finance_tracker.service.LoanService;
import com.finance_tracker.service.SipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test/scheduler")
public class TestSchedulerController {

    @Autowired
    private InvestmentService investmentService;

    @Autowired
    private SipService sipService;

    @Autowired
    private LoanService loanService;

    @PostMapping("/update-investment-prices")
    public ResponseEntity<String> triggerInvestmentPriceUpdate() {
        investmentService.updateCurrentPrices();
        return ResponseEntity.ok("Investment prices update triggered successfully");
    }

    @PostMapping("/update-sip-navs")
    public ResponseEntity<String> triggerSipNavUpdate() {
        sipService.updateCurrentNavs();
        return ResponseEntity.ok("SIP NAVs update triggered successfully");
    }

    @PostMapping("/process-monthly-sips")
    public ResponseEntity<String> triggerMonthlySipProcess() {
        sipService.processMonthlyInvestments();
        return ResponseEntity.ok("Monthly SIP processing triggered successfully");
    }

    @PostMapping("/update-loan-balances")
    public ResponseEntity<String> triggerLoanBalanceUpdate() {
        loanService.updateLoanBalances();
        return ResponseEntity.ok("Loan balances update triggered successfully");
    }
}
