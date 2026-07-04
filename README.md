# SupplyTrack (سامانه درخواست کالا)

SupplyTrack is a comprehensive, full-stack inventory and procurement management system designed to streamline the lifecycle of item requests. It provides specific workflows for Requesters, Supervisors, Storekeepers, and Purchasers to ensure accountability and efficiency in resource allocation.

## Features

- **Role-Based Workflows:** Distinct interfaces for:
  - `requester`: Creates requests for items.
  - `supervisor`: Approves or rejects requests.
  - `storekeeper`: Checks warehouse inventory, reserves stock, and marks shortages.
  - `purchaser`: Fulfills shortage items by purchasing them.
- **Real-Time Dashboards:** Visualizations of inventory trends and request statuses.
- **Client-Side Filtering:** Searchable tables for fast access to SKU and inventory logs.
- **Notification System:** In-app toast notifications for critical alerts, such as low inventory thresholds.
- **Mobile-Responsive:** Tailored UI ensuring a great experience on mobile devices and desktops.
- **Localization:** Persian number formatting and native UI texts.

## Architecture

- **Frontend:** React 18, React Router, Tailwind CSS, Recharts for analytics.
- **Backend:** Express.js running concurrently with Vite (development) or serving static files (production).
- **Authentication:** JWT-based secure authentication.
- **State Management:** React Context API (Auth, Theme, Settings, Toast).

## Quick Start

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

### Production Build

To build the application for production:
```bash
npm run build
```
Start the production server:
```bash
npm start
```

## Available Roles for Testing
- **Admin**: `admin` / `password`
- **Requester**: `reza` / `password`
- **Supervisor**: `hasan` / `password`
- **Storekeeper**: `maryam` / `password`
- **Purchaser**: `sina` / `password`
