package com.bikerental.repository;

import com.bikerental.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);
    List<Booking> findByVehicleShopVendorId(Long vendorId);
    List<Booking> findByVehicleId(Long vehicleId);
}
