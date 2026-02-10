package com.bikerental.dto;

public class ShopResponse {

    private Long id;
    private String vendorName;
    private String shopName;
    private String address;
    private Double latitude;
    private Double longitude;

    public ShopResponse() {
    }

    public ShopResponse(Long id, String vendorName, String shopName, String address,
                        Double latitude, Double longitude) {
        this.id = id;
        this.vendorName = vendorName;
        this.shopName = shopName;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getVendorName() {
        return vendorName;
    }

    public void setVendorName(String vendorName) {
        this.vendorName = vendorName;
    }

    public String getShopName() {
        return shopName;
    }

    public void setShopName(String shopName) {
        this.shopName = shopName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }
}
