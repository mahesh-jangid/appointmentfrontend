# Mini Appointment Scheduler

A MERN stack application for scheduling appointments between doctors and patients. This application handles time slot management, conflict detection, and provides slot suggestions when requested slots are unavailable.

## Features

- Doctor management with configurable:
  - Working days
  - Working hours
  - Appointment slot duration
  - Break periods
- Patient appointment booking with:
  - Real-time slot availability checking
  - Conflict detection
  - Alternative slot suggestions
  - Easy-to-use interface

## Tech Stack

- **Frontend**: React with TypeScript and Vite
- **Backend**: Express.js with Node.js
- **Database**: MongoDB
- **Styling**: Tailwind CSS

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

## Project Structure

```
/
├── server/             # Backend Express.js server
│   ├── src/
│   │   ├── models/     # MongoDB schemas
│   │   ├── routes/     # API routes
│   │   ├── controllers/# Route controllers
│   │   └── utils/      # Utility functions
│   └── package.json
└── src/               # Frontend React application
    ├── components/    # React components
    ├── App.tsx       # Main application component
    └── package.json
```

## Setup Instructions

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory with the following content:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/appointment-scheduler
   ```

4. Seed the database with initial doctor data:
   ```bash
   npm run seed
   ```

5. Start the server:
   ```bash
   npm run dev
   ```

The server will start on http://localhost:5000

### Frontend Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at http://localhost:5173

## API Endpoints

- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/available-slots` - Get available slots for a specific doctor and date
- `POST /api/appointments` - Create a new appointment
- `GET /api/appointments` - Get appointments (can be filtered by doctor and date)

## Time Slot Management

The application handles time slots with the following considerations:

1. Slots are generated based on doctor's working hours and break periods
2. Each slot has a fixed duration (e.g., 20 minutes)
3. No appointments can be scheduled during break periods
4. The system prevents double-booking by checking for conflicts
5. When a requested slot is unavailable, the system suggests the next available slot
```
