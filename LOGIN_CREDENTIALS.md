# HomeFit - Login Credentials

## Available Test Accounts

Based on the database, here are the available accounts. **Note:** You may need to create new accounts or reset passwords if you don't know the current passwords.

### Admin Account
- **Email:** `admin@example.com`
- **Type:** Admin
- **Password:** (Unknown - you'll need to reset or create a new one)

### Admin Account 2
- **Email:** `suhas@example.com`
- **Type:** Admin
- **Password:** (Unknown - you'll need to reset or create a new one)

### Regular User Accounts
- **Email:** `testuser@example.com`
- **Type:** User
- **Password:** (Unknown - you'll need to reset or create a new one)

### Other Accounts Found:
- `baluvanahallyraman.s@northeastern.edu` (User)
- `gautam@example.com` (User)
- `namratha@example.com` (User)
- `monil@example.com` (User)

---

## How to Create Test Accounts

Since passwords are hashed, the easiest way is to:

### Option 1: Create New Accounts via Signup
1. Go to `http://localhost:3000`
2. Click "Sign Up"
3. Create accounts with known passwords:
   - **Admin:** Use email `admin@homefit.com` and select appropriate type
   - **User:** Use email `user@homefit.com`
   - **Broker:** Use email `broker@homefit.com` (will need admin approval)

### Option 2: Create Test Accounts via API/Code
You can use the signup endpoint to create accounts with known passwords:

```bash
# Create Admin Account
curl -X POST http://localhost:4000/api/user/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@homefit.com",
    "password": "admin123",
    "fullName": "Test Admin",
    "type": "admin"
  }'

# Create User Account
curl -X POST http://localhost:4000/api/user/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@homefit.com",
    "password": "user123",
    "fullName": "Test User",
    "type": "user"
  }'
```

---

## Recommended Test Accounts for Portfolio Demo

**Admin Account:**
- Email: `admin@homefit.com`
- Password: `admin123`
- Type: Admin

**Regular User:**
- Email: `user@homefit.com`
- Password: `user123`
- Type: User

**Broker Account:**
- Email: `broker@homefit.com`
- Password: `broker123`
- Type: Broker (will need admin approval)

---

## Quick Setup Script

Run this to create test accounts (if signup endpoint allows admin creation):

```javascript
// You can run this in Node.js to create test accounts
const mongoose = require('mongoose');
const User = require('./backend/src/models/User');
require('dotenv').config();

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  
  // Create admin
  const admin = new User({
    email: 'admin@homefit.com',
    password: 'admin123',
    fullName: 'Demo Admin',
    type: 'admin'
  });
  await admin.save();
  
  // Create user
  const user = new User({
    email: 'user@homefit.com',
    password: 'user123',
    fullName: 'Demo User',
    type: 'user'
  });
  await user.save();
  
  console.log('Test accounts created!');
  process.exit(0);
})();
```

