package com.bikerental.controller;

import com.bikerental.dto.ShopRequest;
import com.bikerental.dto.ShopResponse;
import com.bikerental.exception.BadRequestException;
import com.bikerental.service.ShopService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shops")
public class ShopController {

    private final ShopService shopService;

    public ShopController(ShopService shopService) {
        this.shopService = shopService;
    }

    @PostMapping
    public ResponseEntity<ShopResponse> createShop(@Valid @RequestBody ShopRequest request,
                                                    Authentication authentication) {
        if (!authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_VENDOR"))) {
            throw new BadRequestException("Only vendors can create shops");
        }
        return ResponseEntity.ok(shopService.createShop(request, authentication.getName()));
    }

    @GetMapping
    public ResponseEntity<List<ShopResponse>> getAllShops() {
        return ResponseEntity.ok(shopService.getAllShops());
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<ShopResponse>> getNearbyShops(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam double radius) {
        return ResponseEntity.ok(shopService.getNearbyShops(lat, lng, radius));
    }

    @GetMapping("/vendor")
    public ResponseEntity<List<ShopResponse>> getVendorShops(Authentication authentication) {
        if (!authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_VENDOR"))) {
            throw new BadRequestException("Only vendors can access this endpoint");
        }
        return ResponseEntity.ok(shopService.getShopsByVendor(authentication.getName()));
    }
}
