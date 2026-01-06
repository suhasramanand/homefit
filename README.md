# HomeFit – Apartment Finder & Broker Portal

**HomeFit** is a full-stack web application that connects renters with apartment listings while offering an internal broker and admin management system. The platform supports listing management, broker registration and approval workflows, user preferences, and smart apartment matching.

## Tech Stack

![React](https://img.shields.io/badge/React-19.0.0-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)
![Material-UI](https://img.shields.io/badge/Material--UI-6.4.8-007FFF?logo=mui&logoColor=white)
![Redux](https://img.shields.io/badge/Redux-2.6.1-764ABC?logo=redux&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.18.2-000000?logo=express&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-7.5.0-880000?logo=mongoose&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-4.7.0-DC382D?logo=redis&logoColor=white)
![Groq API](https://img.shields.io/badge/Groq-AI-FF6B6B?logo=openai&logoColor=white)
![Google Maps](https://img.shields.io/badge/Google_Maps-API-4285F4?logo=googlemaps&logoColor=white)

---

## Features

### User-Facing
- User Signup/Login
- Preference-based apartment matching
- Save and view favorite listings
- AI-assisted apartment match explanations (via Groq API)
- Inquiry system to contact brokers

### Broker Dashboard
- Multi-step broker registration with license verification
- Pending approval system (admin approval required)
- Add, manage, and delete listings
- View and respond to listing inquiries
- View listing performance and analytics
- Profile management and document upload

### Admin Dashboard
- View/manage all brokers, users, and listings
- Approve or reject broker registrations
- Download and view license documents
- System settings 

---

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/suhasreddy-northeastern/homefit.git
```
```
cd homefit
```
### 2. Setup the server
```bash
cd backend
npm install
```
### Create a .env file and include:
``` bash
.env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/homefit
SESSION_SECRET=your_secret_here
```
### Start the server:

```bash
npm run dev
```
### 3. Setup the frontend
```bash
cd frontend
npm install
npm start
```
## Running Both Backend and Frontend Concurrently

To run both the backend and frontend simultaneously:

1. Make sure you're in the root directory of the project (where `package.json` is located).

2. If you haven't already, install `concurrently`:
   ```bash
   npm install -g concurrently
   ```

3. Add a `package.json` script to run both servers:
   * In the **root directory** (where you have both `backend` and `frontend` folders), open the `package.json` file.
   * Add the following under `"scripts"`:
     ```json
     "scripts": {
       "dev": "concurrently \"npm run dev --prefix backend\" \"npm start --prefix frontend\""
     }
     ```

4. Now, you can run both the frontend and backend servers with a single command:
   ```bash
   npm run dev
   ```
   This will start both the frontend and backend concurrently.

### Project Structure
```
/frontend
  └── components/
  └── pages/
  └── redux/
  └── utils/
  └── App.js
  └── index.js

/backend
  └── controllers/
  |    └── brokerController.js
  |    └── userController.js
  └── middleware/
  |    └── checkAuth.js
  |    └── checkApprovedBroker.js
  └── models/
  |    └── User.js
  |    └── Apartment.js
  |    └── Inquiry.js
  └── routes/
  |    └── brokerRoutes.js
  |    └── userRoutes.js
  |    └── adminRoutes.js
  └── uploads/   (stores license documents)
  └── server.js
  ```

### API Highlights
```
/api/broker/register
```
Register broker with document upload

```
/api/broker/me
```
Get broker profile (protected route)
```
/api/broker/profile
```
Update profile (name, phone)
```
/api/broker/listings
```
CRUD operations on listings (broker-only)

### Authentication & Sessions
1. Uses express-session with cookie-based authentication

2. Role-based access control: admin, broker, user

### Future Enhancements
1. Email notifications for inquiries and approvals

2. AI-enhanced search and personalized recommendations

3. Subscription model for premium brokers

4. Mobile app version (React Native)

## Contributors

| Name    | Contribution (%) | Area of Focus                                     |
|---------|------------------|---------------------------------------------------|
| Suhas   | 40%              | Full-stack architecture, broker system, Groq API  |
| Varun   | 20%              | Admin dashboard, broker approval system           |
| Prerana | 15%              | Frontend styling, registration flows              |
| Manasa  | 15%              | Inquiry system, backend testing                   |
| Rajat   | 10%              | Documentation, helper utilities, deployment setup |



Screenshots








