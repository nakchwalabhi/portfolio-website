package com.bikerental.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class BookingRequest {

    @NotNull(message = "Vehicle ID is required")
    private Long vehicleId;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    public BookingRequest() {
    }

    public BookingRequest(Long vehicleId, LocalDate startDate, LocalDate endDate) {
        this.vehicleId = vehicleId;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public Long getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(Long vehicleId) {
        this.vehicleId = vehicleId;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }
}
