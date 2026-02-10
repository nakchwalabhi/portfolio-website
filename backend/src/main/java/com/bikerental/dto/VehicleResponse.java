package com.bikerental.dto;

import java.math.BigDecimal;

public class VehicleResponse {

    private Long id;
    private Long shopId;
    private String shopName;
    private String name;
    private String type;
    private BigDecimal pricePerDay;
    private boolean available;
    private String imageUrl;

    public VehicleResponse() {
    }

    public VehicleResponse(Long id, Long shopId, String shopName, String name, String type,
                           BigDecimal pricePerDay, boolean available, String imageUrl) {
        this.id = id;
        this.shopId = shopId;
        this.shopName = shopName;
        this.name = name;
        this.type = type;
        this.pricePerDay = pricePerDay;
        this.available = available;
        this.imageUrl = imageUrl;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getShopId() {
        return shopId;
    }

    public void setShopId(Long shopId) {
        this.shopId = shopId;
    }

    public String getShopName() {
        return shopName;
    }

    public void setShopName(String shopName) {
        this.shopName = shopName;
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

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
