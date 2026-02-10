package com.bikerental.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class VehicleRequest {

    @NotNull(message = "Shop ID is required")
    private Long shopId;

    @NotBlank(message = "Vehicle name is required")
    private String name;

    @NotBlank(message = "Vehicle type is required")
    private String type;

    @NotNull(message = "Price per day is required")
    private BigDecimal pricePerDay;

    private String imageUrl;

    public VehicleRequest() {
    }

    public VehicleRequest(Long shopId, String name, String type, BigDecimal pricePerDay, String imageUrl) {
        this.shopId = shopId;
        this.name = name;
        this.type = type;
        this.pricePerDay = pricePerDay;
        this.imageUrl = imageUrl;
    }

    public Long getShopId() {
        return shopId;
    }

    public void setShopId(Long shopId) {
        this.shopId = shopId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public BigDecimal getPricePerDay() {
        return pricePerDay;
    }

    public void setPricePerDay(BigDecimal pricePerDay) {
        this.pricePerDay = pricePerDay;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
