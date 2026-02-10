package com.bikerental.controller;

import com.bikerental.dto.PaymentRequest;
import com.bikerental.dto.PaymentResponse;
import com.bikerental.dto.PaymentVerificationRequest;
import com.bikerental.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create-order")
    public ResponseEntity<PaymentResponse> createOrder(@Valid @RequestBody PaymentRequest request) {
        return ResponseEntity.ok(paymentService.createOrder(request.getBookingId()));
    }

    @PostMapping("/verify")
    public ResponseEntity<Map<String, String>> verifyPayment(
            @Valid @RequestBody PaymentVerificationRequest request) {
        paymentService.verifyPayment(request);
        return ResponseEntity.ok(Map.of("message", "Payment verified successfully"));
    }
}
