# 🚲 Bike Rental Marketplace App — Dehradun

A mobile application platform connecting bike rental shop owners (vendors) and customers (clients) in Dehradun. Vendors can list their rental shops, vehicles, and prices, while users can browse options, book vehicles, and pay a partial amount online to confirm bookings.

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Mobile App | React Native (Expo SDK 51) |
| Backend | Java Spring Boot 3.2.x (REST APIs) |
| Database | PostgreSQL |
| Authentication | JWT (JSON Web Tokens) |
| Payment Gateway | Razorpay (50% advance payment) |

## Project Structure

```
├── backend/                        # Spring Boot REST API
│   ├── pom.xml                     # Maven dependencies
│   └── src/main/java/com/bikerental/
│       ├── BikeRentalApplication.java
│       ├── controller/             # REST controllers
│       │   ├── AuthController.java
│       │   ├── ShopController.java
│       │   ├── VehicleController.java
│       │   ├── BookingController.java
│       │   └── PaymentController.java
│       ├── model/                  # JPA entities
│       │   ├── User.java
│       │   ├── Shop.java
│       │   ├── Vehicle.java
│       │   ├── Booking.java
│       │   └── enums (Role, VehicleType, BookingStatus)
│       ├── repository/             # Spring Data JPA repositories
│       ├── service/                # Business logic
│       ├── security/               # JWT auth & Spring Security
│       ├── dto/                    # Request/Response DTOs
│       └── exception/              # Global exception handling
│
├── mobile/                         # React Native (Expo) App
│   ├── App.js                      # Entry point
│   ├── app.json                    # Expo configuration
│   ├── package.json                # Dependencies
│   └── src/
│       ├── context/AuthContext.js   # Authentication state
│       ├── services/api.js          # API client
│       ├── navigation/AppNavigator.js
│       └── screens/
│           ├── client/             # Client screens
│           │   ├── LoginScreen.js
│           │   ├── RegisterScreen.js
│           │   ├── ShopListScreen.js
│           │   ├── VehicleListScreen.js
│           │   ├── BookingScreen.js
│           │   ├── PaymentScreen.js
│           │   └── BookingHistoryScreen.js
│           └── vendor/             # Vendor screens
│               ├── VendorLoginScreen.js
│               ├── ShopDashboardScreen.js
│               ├── AddVehicleScreen.js
│               └── BookingManagementScreen.js
```

## User Roles

### Client (Normal User)
- Register and log in
- Browse nearby rental shops
- View available bikes and scooters with prices
- Select rental dates and book vehicles
- Pay 50% advance online to confirm booking
- View booking history and status

### Vendor (Rental Shop Owner)
- Log in with invite-only accounts
- Create and manage shop profile with location
- Add bikes and scooters with pricing
- Update vehicle availability
- View and manage booking requests (accept/reject/complete)

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |

### Shops
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/shops` | List all shops |
| GET | `/api/shops/nearby?lat=&lng=&radius=` | Find shops within radius |
| GET | `/api/shops/vendor` | Get current vendor's shops |
| POST | `/api/shops` | Create a shop (vendor only) |

### Vehicles
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/vehicles/shop/{shopId}` | List vehicles by shop |
| POST | `/api/vehicles` | Add a vehicle (vendor only) |
| PUT | `/api/vehicles/{id}/availability` | Update availability (vendor only) |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create a booking (client only) |
| GET | `/api/bookings/my` | Get client's bookings |
| GET | `/api/bookings/vendor` | Get vendor's bookings |
| PUT | `/api/bookings/{id}/status` | Update booking status (vendor only) |

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/create-order` | Create Razorpay order (50% advance) |
| POST | `/api/payments/verify` | Verify payment and confirm booking |

## Database Schema

### Users
| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key |
| name | VARCHAR | User's full name |
| email | VARCHAR | Unique email |
| password | VARCHAR | BCrypt hashed |
| role | ENUM | CLIENT or VENDOR |
| created_at | TIMESTAMP | Creation timestamp |

### Shops
| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key |
| vendor_id | BIGINT | FK to Users |
| shop_name | VARCHAR | Shop display name |
| address | VARCHAR | Full address |
| latitude | DOUBLE | GPS latitude |
| longitude | DOUBLE | GPS longitude |

### Vehicles
| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key |
| shop_id | BIGINT | FK to Shops |
| name | VARCHAR | Vehicle name |
| type | ENUM | BIKE or SCOOTER |
| price_per_day | DECIMAL | Rental rate |
| available | BOOLEAN | Availability status |
| image_url | VARCHAR | Vehicle image URL |

### Bookings
| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key |
| user_id | BIGINT | FK to Users |
| vehicle_id | BIGINT | FK to Vehicles |
| start_date | DATE | Rental start |
| end_date | DATE | Rental end |
| total_price | DECIMAL | Full amount |
| advance_paid | DECIMAL | 50% advance |
| status | ENUM | PENDING/CONFIRMED/REJECTED/COMPLETED |
| razorpay_order_id | VARCHAR | Razorpay order reference |
| razorpay_payment_id | VARCHAR | Razorpay payment reference |

## Getting Started

### Prerequisites
- Java 17+
- Maven 3.8+
- PostgreSQL 14+
- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- Android Studio / Xcode (for emulator)

### Backend Setup

1. **Create PostgreSQL database:**
   ```sql
   CREATE DATABASE bikerental;
   ```

2. **Configure environment variables** (or edit `application.properties`):
   ```
   SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/bikerental
   SPRING_DATASOURCE_USERNAME=postgres
   SPRING_DATASOURCE_PASSWORD=your_password
   APP_JWT_SECRET=your-secret-key-at-least-256-bits
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```

3. **Build and run:**
   ```bash
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```
   The API will be available at `http://localhost:8080`.

### Mobile App Setup

1. **Install dependencies:**
   ```bash
   cd mobile
   npm install
   ```

2. **Update API base URL** in `src/services/api.js`:
   - Android Emulator: `http://10.0.2.2:8080/api`
   - iOS Simulator: `http://localhost:8080/api`
   - Physical device: `http://YOUR_IP:8080/api`

3. **Start the app:**
   ```bash
   npx expo start
   ```

4. **Run on device/emulator:**
   - Press `a` for Android
   - Press `i` for iOS
   - Scan QR code with Expo Go app

## Booking Flow

1. Client registers and logs in
2. Browses available shops (sorted by distance)
3. Selects a shop and views available vehicles
4. Picks a vehicle, enters rental dates
5. System calculates total price
6. Client creates booking → status: **PENDING**
7. Client pays 50% advance via Razorpay → status: **CONFIRMED**
8. Vendor can accept/reject bookings
9. After rental period, vendor marks booking as **COMPLETED**

## Optional Features (Future Scope)

- Ratings and reviews for shops/vehicles
- Search and filters (by type, price range)
- Map view of shops using Google Maps
- Push notifications for booking updates
- Favorite shops for quick access
