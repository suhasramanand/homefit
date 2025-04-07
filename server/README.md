
# AptMatchBuddy Backend API

This is the backend API for the AptMatchBuddy apartment matching application.

## Setup Instructions

1. Create a `.env` file based on `.env.example`
2. Install dependencies:
   ```
   npm install
   ```
3. Create a folder for image uploads:
   ```
   mkdir uploads
   ```
4. Start the server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Apartments
- `GET /api/apartments` - Get all apartments (with optional filters)
- `GET /api/apartments/:id` - Get apartment by ID
- `POST /api/apartments` - Create a new apartment (broker only)
- `PUT /api/apartments/:id` - Update apartment (broker only)
- `DELETE /api/apartments/:id` - Delete apartment (broker only)
- `GET /api/apartments/broker/:brokerId` - Get apartments by broker ID

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/favorites/:apartmentId` - Save apartment to favorites
- `DELETE /api/users/favorites/:apartmentId` - Remove apartment from favorites
- `GET /api/users/favorites` - Get user's saved apartments
- `PUT /api/users/preferences` - Update user preferences
- `GET /api/users/preferences` - Get user's preferences

### Brokers
- `GET /api/brokers` - Get all brokers (admin only)
- `PUT /api/brokers/approve/:userId` - Approve broker application (admin only)
- `GET /api/brokers/listings` - Get broker's listings
- `GET /api/brokers/:id` - Get broker profile by ID
- `POST /api/brokers/apply` - Apply to become a broker

## Authentication
All protected routes require a JWT token sent in the Authorization header:
```
Authorization: Bearer your_token_here
```

## Database Structure

### Users Collection
- User data including authentication info, preferences, and saved apartments

### Apartments Collection
- Apartment listings with detailed information

## Roles
- `user` - Regular users who can search and save apartments
- `broker` - Property managers who can create and manage listings
- `admin` - Administrators who can approve broker applications
