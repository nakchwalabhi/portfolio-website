package com.bikerental.repository;

import com.bikerental.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    List<Vehicle> findByShopId(Long shopId);
    List<Vehicle> findByShopIdAndAvailableTrue(Long shopId);
}
