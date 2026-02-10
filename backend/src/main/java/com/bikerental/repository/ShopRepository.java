package com.bikerental.repository;

import com.bikerental.model.Shop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShopRepository extends JpaRepository<Shop, Long> {

    List<Shop> findByVendorId(Long vendorId);

    @Query(value = "SELECT * FROM shops s WHERE " +
            "(6371 * acos(cos(radians(:lat)) * cos(radians(s.latitude)) * " +
            "cos(radians(s.longitude) - radians(:lng)) + " +
            "sin(radians(:lat)) * sin(radians(s.latitude)))) <= :radius",
            nativeQuery = true)
    List<Shop> findNearbyShops(@Param("lat") double lat,
                               @Param("lng") double lng,
                               @Param("radius") double radius);
}
