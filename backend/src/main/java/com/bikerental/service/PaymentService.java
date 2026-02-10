package com.bikerental.service;

import com.bikerental.dto.PaymentResponse;
import com.bikerental.dto.PaymentVerificationRequest;
import com.bikerental.exception.BadRequestException;
import com.bikerental.exception.ResourceNotFoundException;
import com.bikerental.model.Booking;
import com.bikerental.model.BookingStatus;
import com.bikerental.repository.BookingRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class PaymentService {

    private final BookingRepository bookingRepository;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    public PaymentService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public PaymentResponse createOrder(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        // 50% advance payment
        BigDecimal advanceAmount = booking.getTotalPrice()
                .divide(BigDecimal.valueOf(2), 2, RoundingMode.HALF_UP);

        // Razorpay expects amount in paise (smallest currency unit)
        int amountInPaise = advanceAmount.multiply(BigDecimal.valueOf(100)).intValue();

        try {
            RazorpayClient client = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "booking_" + bookingId);

            Order order = client.orders.create(orderRequest);

            String orderId = order.get("id");
            booking.setRazorpayOrderId(orderId);
            booking.setAdvancePaid(advanceAmount);
            bookingRepository.save(booking);

            return new PaymentResponse(orderId, advanceAmount, "INR", bookingId);
        } catch (RazorpayException e) {
            throw new BadRequestException("Failed to create Razorpay order: " + e.getMessage());
        }
    }

    public void verifyPayment(PaymentVerificationRequest request) {
        try {
            JSONObject attributes = new JSONObject();
            attributes.put("razorpay_order_id", request.getRazorpayOrderId());
            attributes.put("razorpay_payment_id", request.getRazorpayPaymentId());
            attributes.put("razorpay_signature", request.getRazorpaySignature());

            boolean isValid = Utils.verifyPaymentSignature(attributes, razorpayKeySecret);

            if (!isValid) {
                throw new BadRequestException("Invalid payment signature");
            }

            Booking booking = bookingRepository.findAll().stream()
                    .filter(b -> request.getRazorpayOrderId().equals(b.getRazorpayOrderId()))
                    .findFirst()
                    .orElseThrow(() -> new ResourceNotFoundException("Booking not found for this order"));

            booking.setRazorpayPaymentId(request.getRazorpayPaymentId());
            booking.setStatus(BookingStatus.CONFIRMED);
            bookingRepository.save(booking);

        } catch (RazorpayException e) {
            throw new BadRequestException("Payment verification failed: " + e.getMessage());
        }
    }
}
