package com.bikerental.service;

import com.bikerental.dto.BookingRequest;
import com.bikerental.dto.BookingResponse;
import com.bikerental.exception.BadRequestException;
import com.bikerental.exception.ResourceNotFoundException;
import com.bikerental.model.Booking;
import com.bikerental.model.BookingStatus;
import com.bikerental.model.User;
import com.bikerental.model.Vehicle;
import com.bikerental.repository.BookingRepository;
import com.bikerental.repository.UserRepository;
import com.bikerental.repository.VehicleRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;

    public BookingService(BookingRepository bookingRepository, VehicleRepository vehicleRepository,
                          UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.vehicleRepository = vehicleRepository;
        this.userRepository = userRepository;
    }

    public BookingResponse createBooking(BookingRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));

        if (!vehicle.isAvailable()) {
            throw new BadRequestException("Vehicle is not available");
        }

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new BadRequestException("End date must be after start date");
        }

        long days = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate());
        if (days == 0) {
            days = 1; // Same-day rental counts as 1 day
        }

        BigDecimal totalPrice = vehicle.getPricePerDay().multiply(BigDecimal.valueOf(days));

        Booking booking = new Booking(user, vehicle, request.getStartDate(),
                request.getEndDate(), totalPrice, BookingStatus.PENDING);
        booking = bookingRepository.save(booking);
        return mapToResponse(booking);
    }

    public List<BookingResponse> getBookingsByUser(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return bookingRepository.findByUserId(user.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<BookingResponse> getBookingsForVendor(String vendorEmail) {
        User vendor = userRepository.findByEmail(vendorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found"));

        return bookingRepository.findByVehicleShopVendorId(vendor.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public BookingResponse updateBookingStatus(Long bookingId, String status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        BookingStatus bookingStatus;
        try {
            bookingStatus = BookingStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid status");
        }

        booking.setStatus(bookingStatus);
        booking = bookingRepository.save(booking);
        return mapToResponse(booking);
    }

    public BookingResponse completeBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        booking.setStatus(BookingStatus.COMPLETED);
        booking = bookingRepository.save(booking);
        return mapToResponse(booking);
    }

    private BookingResponse mapToResponse(Booking booking) {
        return new BookingResponse(
                booking.getId(),
                booking.getVehicle().getName(),
                booking.getVehicle().getShop().getShopName(),
                booking.getStartDate(),
                booking.getEndDate(),
                booking.getTotalPrice(),
                booking.getAdvancePaid(),
                booking.getStatus().name()
        );
    }
}
