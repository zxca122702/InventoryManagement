# Fox Control Hub - Login System

A secure login system for the Fox Control Hub inventory management application with Node.js backend and Neon PostgreSQL database.

## Features

- 🔐 Secure user authentication with bcrypt password hashing
- 🦊 Beautiful, responsive login interface matching the Fox Control Hub theme
- 🗄️ Neon PostgreSQL database integration
- 🛡️ Session-based authentication middleware
- 📱 Mobile-responsive design
- 🔄 Automatic redirect to inventory page after successful login
- 👤 Default admin user (username: `admin`, password: `admin`)

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Neon PostgreSQL database account

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

1. Copy the `.env` file and update it with your Neon database credentials:

```env
# Neon Database Configuration
DATABASE_URL=your_neon_database_url_here

# Session Secret (change this to a random string in production)
SESSION_SECRET=your_super_secret_key_here

# Server Configuration
PORT=3000

# Admin User Configuration
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin
```

2. Get your Neon database URL:
   - Go to [Neon Console](https://console.neon.tech/)
   - Create a new project or use an existing one
   - Go to the "Connection Details" section
   - Copy the connection string and replace `DATABASE_URL` in your `.env` file

### 3. Start the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

## Usage

### Default Login Credentials

- **Username:** `admin`
- **Password:** `admin`

### Accessing the Application

1. Navigate to `http://localhost:3000`
2. You'll be automatically redirected to the login page
3. Enter the default credentials or any user credentials you've created
4. After successful login, you'll be redirected to the inventory page

### Protected Routes

All the following routes require authentication:
- `/inventory.html` - Main inventory management page
- `/barcode.html` - Barcode management
- `/materialshipments.html` - Material shipments
- `/ordershipments.html` - Order shipments
- `/reports.html` - Reports
- `/stocktracking.html` - Stock tracking
- `/warehouselayandopti.html` - Warehouse layout and optimization

### API Endpoints

- `POST /login` - User authentication
- `POST /logout` - User logout
- `GET /api/user` - Get current user information (requires authentication)

## Database Schema

The application automatically creates a `users` table with the following structure:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Security Features

- Password hashing using bcrypt
- Session-based authentication
- CSRF protection through session management
- SQL injection prevention using parameterized queries
- Secure session configuration

## Development

### File Structure

```
├── server.js              # Main Express server
├── database.js            # Database connection and user management
├── login.html             # Login page
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables
└── README.md              # This file
```

### Adding New Users

Users can be added directly to the database or you can extend the application with a user registration system. The password should be hashed using bcrypt before storing.

## Production Deployment

1. Set `SESSION_SECRET` to a strong, random string
2. Use HTTPS in production (set `cookie.secure` to `true` in session config)
3. Configure proper database connection pooling
4. Set up proper logging and monitoring
5. Use environment variables for all sensitive configuration

## Troubleshooting

### Database Connection Issues

1. Verify your Neon database URL is correct
2. Check that your database is running and accessible
3. Ensure your IP is whitelisted in Neon console (if applicable)

### Login Issues

1. Check browser console for JavaScript errors
2. Verify the server is running on the correct port
3. Check server logs for authentication errors

### Session Issues

1. Clear browser cookies and try again
2. Restart the server to clear server-side sessions
3. Check that SESSION_SECRET is set in environment variables

## License

MIT License - feel free to use this code for your projects.