package com.bikerental.controller;

import com.bikerental.dto.VehicleRequest;
import com.bikerental.dto.VehicleResponse;
import com.bikerental.exception.BadRequestException;
import com.bikerental.service.VehicleService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @PostMapping
    public ResponseEntity<VehicleResponse> addVehicle(@Valid @RequestBody VehicleRequest request,
                                                       Authentication authentication) {
        if (!authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_VENDOR"))) {
            throw new BadRequestException("Only vendors can add vehicles");
        }
        return ResponseEntity.ok(vehicleService.addVehicle(request));
    }

    @GetMapping("/shop/{shopId}")
    public ResponseEntity<List<VehicleResponse>> getVehiclesByShop(@PathVariable Long shopId) {
        return ResponseEntity.ok(vehicleService.getVehiclesByShop(shopId));
    }

    @PutMapping("/{id}/availability")
    public ResponseEntity<VehicleResponse> updateAvailability(@PathVariable Long id,
                                                               @RequestParam boolean available,
                                                               Authentication authentication) {
        if (!authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_VENDOR"))) {
            throw new BadRequestException("Only vendors can update vehicle availability");
        }
        return ResponseEntity.ok(vehicleService.updateAvailability(id, available));
    }
}
