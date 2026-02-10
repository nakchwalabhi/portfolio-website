package com.bikerental.service;

import com.bikerental.dto.ShopRequest;
import com.bikerental.dto.ShopResponse;
import com.bikerental.exception.ResourceNotFoundException;
import com.bikerental.model.Shop;
import com.bikerental.model.User;
import com.bikerental.repository.ShopRepository;
import com.bikerental.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShopService {

    private final ShopRepository shopRepository;
    private final UserRepository userRepository;

    public ShopService(ShopRepository shopRepository, UserRepository userRepository) {
        this.shopRepository = shopRepository;
        this.userRepository = userRepository;
    }

    public ShopResponse createShop(ShopRequest request, String vendorEmail) {
        User vendor = userRepository.findByEmail(vendorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found"));

        Shop shop = new Shop(vendor, request.getShopName(), request.getAddress(),
                request.getLatitude(), request.getLongitude());
        shop = shopRepository.save(shop);
        return mapToResponse(shop);
    }

    public List<ShopResponse> getShopsByVendor(String vendorEmail) {
        User vendor = userRepository.findByEmail(vendorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found"));

        return shopRepository.findByVendorId(vendor.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ShopResponse> getAllShops() {
        return shopRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ShopResponse> getNearbyShops(double lat, double lng, double radius) {
        return shopRepository.findNearbyShops(lat, lng, radius).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ShopResponse mapToResponse(Shop shop) {
        return new ShopResponse(
                shop.getId(),
                shop.getVendor().getName(),
                shop.getShopName(),
                shop.getAddress(),
                shop.getLatitude(),
                shop.getLongitude()
        );
    }
}
