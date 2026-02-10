package com.bikerental.controller;

import com.bikerental.dto.BookingRequest;
import com.bikerental.dto.BookingResponse;
import com.bikerental.exception.BadRequestException;
import com.bikerental.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody BookingRequest request,
                                                          Authentication authentication) {
        if (!authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_CLIENT"))) {
            throw new BadRequestException("Only clients can create bookings");
        }
        return ResponseEntity.ok(bookingService.createBooking(request, authentication.getName()));
    }

    @GetMapping("/my")
    public ResponseEntity<List<BookingResponse>> getMyBookings(Authentication authentication) {
        return ResponseEntity.ok(bookingService.getBookingsByUser(authentication.getName()));
    }

    @GetMapping("/vendor")
    public ResponseEntity<List<BookingResponse>> getVendorBookings(Authentication authentication) {
        if (!authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_VENDOR"))) {
            throw new BadRequestException("Only vendors can access this endpoint");
        }
        return ResponseEntity.ok(bookingService.getBookingsForVendor(authentication.getName()));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<BookingResponse> updateBookingStatus(@PathVariable Long id,
                                                                @RequestParam String status,
                                                                Authentication authentication) {
        if (!authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_VENDOR"))) {
            throw new BadRequestException("Only vendors can update booking status");
        }
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, status));
    }
}
