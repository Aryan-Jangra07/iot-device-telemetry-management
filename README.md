# IoT Device Telemetry Management

A production-grade, full-stack IoT device telemetry management system. This system provides a robust administration platform to manage connected IoT devices, reliably acquire real-time telemetry data via MQTT, store it securely utilizing optimized databases, and present comprehensive analytics through a modern React-based visualization dashboard.

## System Architecture Overview

This project implements a scalable architecture designed for IoT workloads:

- **Edge/Device Layer:** Devices communicate via the lightweight MQTT protocol.
- **Ingestion Layer:** An integrated Aedes MQTT broker handles concurrent device connections and data intake.
- **Processing Layer:** A Node.js/Express backend coordinates data flow, authenticates clients, and persists telemetry and device metadata securely.
- **Persistence Layer:** A dual-database strategy employing MongoDB for structured metadata and InfluxDB for high-throughput time-series telemetry data.
- **Presentation Layer:** A responsive React application providing real-time operational insights and device administration.

---

## Features

### Backend Infrastructure
- **Real-time MQTT Broker:** Integrated Aedes MQTT broker engineered for efficient device telemetry ingestion and management.
- **Comprehensive RESTful API:** Provides systematic endpoints for device lifecycle management, telemetry querying, and user administration (fully documented via Swagger/OpenAPI).
- **Enterprise-Grade Security:**
  - Robust Authentication: JWT-based user authentication system.
  - Authorization: Granular Role-Based Access Control (RBAC).
  - Hardened endpoints using Helmet, standard CORS policies, and rate-limiting protocols.
- **Optimized Data Persistence:**
  - **MongoDB:** Manages relational/structured data accurately (user accounts, device configurations, metadata).
  - **InfluxDB:** Purpose-built time-series backend ensuring high-velocity read/write telemetry data streams (temperature, humidity, voltage, etc.).

### Frontend Application
- **Administrative Dashboard:** A highly interactive and professional user interface crafted with React and Tailwind CSS.
- **Real-time Analytics:** Implements dynamic, reactive charting solutions via Recharts for instant data monitoring.
- **Responsive Architecture:** Fully optimized layout adapting seamlessly across desktop and mobile environments.
- **Secure State Management:** Secure client-side routing, protected administrative routes, and comprehensive authentication workflows.

---

## Technical Stack

### Frontend Components
- **Framework:** React 19 + Vite
- **Styling Architecture:** Tailwind CSS
- **Iconography:** Lucide React
- **Data Visualization:** Recharts
- **API Communication:** Axios
- **Routing Engine:** React Router DOM

### Backend Components
- **Runtime Environment:** Node.js
- **Server Framework:** Express.js
- **IoT Communication:** MQTT (Aedes Broker, MQTT.js)
- **Database Systems:** 
  - MongoDB (via Mongoose ODM)
  - InfluxDB (via `@influxdata/influxdb-client`)
- **Security & Cryptography:** JWT (JSON Web Tokens) & bcryptjs
- **API Documentation:** Swagger UI (OpenAPI Specification)

---

## Installation & Setup

### System Prerequisites
Ensure the following services are installed and appropriately configured in your deployment environment:
- Node.js (v18.x or higher recommended)
- MongoDB instance (Local or Atlas)
- InfluxDB instance (v2.x)

### Repository Initialization

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd IoT-device-telemetry-management
   ```

2. **Backend Configuration:**
   ```bash
   cd Backend
   npm install
   ```
   *Environment Setup:* Create a `.env` file in the `Backend` directory mirroring your infrastructure credentials (MongoDB URI, InfluxDB tokens, JWT Secret keys).
   ```bash
   npm start
   ```

3. **Frontend Configuration:**
   ```bash
   cd ../Frontend
   npm install
   ```
   *Environment Setup:* Configure the frontend `.env` with the appropriate API Base URL if modifying default development ports.
   ```bash
   npm run dev
   ```

---

## Deployment & Service Endpoints

For standard development configuration:

- **Frontend Application Interface:** `http://localhost:5173`
- **Backend API Gateway:** `http://localhost:5000/api`
- **Swagger API Documentation:** `http://localhost:5000/api-docs`
- **MQTT Ingestion Broker:** `mqtt://localhost:1883`

*(Note: Production environments should adjust ports and enable TLS/SSL based on respective `.env` configurations and reverse proxy setups.)*