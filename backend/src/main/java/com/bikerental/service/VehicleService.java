package com.bikerental.service;

import com.bikerental.dto.VehicleRequest;
import com.bikerental.dto.VehicleResponse;
import com.bikerental.exception.BadRequestException;
import com.bikerental.exception.ResourceNotFoundException;
import com.bikerental.model.Shop;
import com.bikerental.model.Vehicle;
import com.bikerental.model.VehicleType;
import com.bikerental.repository.ShopRepository;
import com.bikerental.repository.VehicleRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final ShopRepository shopRepository;

    public VehicleService(VehicleRepository vehicleRepository, ShopRepository shopRepository) {
        this.vehicleRepository = vehicleRepository;
        this.shopRepository = shopRepository;
    }

    public VehicleResponse addVehicle(VehicleRequest request) {
        Shop shop = shopRepository.findById(request.getShopId())
                .orElseThrow(() -> new ResourceNotFoundException("Shop not found"));

        VehicleType type;
        try {
            type = VehicleType.valueOf(request.getType().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid vehicle type. Must be BIKE or SCOOTER");
        }

        Vehicle vehicle = new Vehicle(shop, request.getName(), type,
                request.getPricePerDay(), request.getImageUrl());
        vehicle = vehicleRepository.save(vehicle);
        return mapToResponse(vehicle);
    }

    public List<VehicleResponse> getVehiclesByShop(Long shopId) {
        return vehicleRepository.findByShopId(shopId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<VehicleResponse> getAvailableVehiclesByShop(Long shopId) {
        return vehicleRepository.findByShopIdAndAvailableTrue(shopId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public VehicleResponse updateAvailability(Long vehicleId, boolean available) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));
        vehicle.setAvailable(available);
        vehicle = vehicleRepository.save(vehicle);
        return mapToResponse(vehicle);
    }

    private VehicleResponse mapToResponse(Vehicle vehicle) {
        return new VehicleResponse(
                vehicle.getId(),
                vehicle.getShop().getId(),
                vehicle.getShop().getShopName(),
                vehicle.getName(),
                vehicle.getType().name(),
                vehicle.getPricePerDay(),
                vehicle.isAvailable(),
                vehicle.getImageUrl()
        );
    }
}
