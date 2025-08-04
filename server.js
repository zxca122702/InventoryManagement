const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Hardcoded admin credentials (no database needed)
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Session configuration
app.use(session({
  secret: 'fox-control-hub-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true if using HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Authentication middleware
const requireAuth = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  } else {
    return res.redirect('/login.html');
  }
};

// Routes

// Root route - redirect to login if not authenticated, otherwise to inventory
app.get('/', (req, res) => {
  if (req.session && req.session.user) {
    res.redirect('/inventory.html');
  } else {
    res.redirect('/login.html');
  }
});

// Login page
app.get('/login.html', (req, res) => {
  if (req.session && req.session.user) {
    res.redirect('/inventory.html');
  } else {
    res.sendFile(path.join(__dirname, 'login.html'));
  }
});

// Login POST route (no database - hardcoded credentials)
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // Simple hardcoded authentication
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      req.session.user = {
        id: 1,
        username: username,
        role: 'admin'
      };
      res.json({ success: true, message: 'Login successful' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Logout route
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Could not log out' });
    }
    res.json({ success: true, message: 'Logout successful' });
  });
});

// Protected routes - require authentication
app.get('/inventory.html', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'Inventory.html'));
});

app.get('/barcode.html', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'Barcode.html'));
});

app.get('/materialshipments.html', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'MaterialShipments.html'));
});

app.get('/ordershipments.html', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'OrderShipments.html'));
});

app.get('/reports.html', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'Reports.html'));
});

app.get('/stocktracking.html', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'StockTracking.html'));
});

app.get('/warehouselayandopti.html', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'WarehouseLayAndOpti.html'));
});

// API route to get current user info
app.get('/api/user', requireAuth, (req, res) => {
  res.json({
    username: req.session.user.username,
    role: req.session.user.role
  });
});

// API route for system status (no database)
app.get('/api/db-status', async (req, res) => {
  res.json({
    connected: false,
    database: 'No database connection',
    host: 'Local Authentication Only',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Fox Control Hub server running on http://localhost:${PORT}`);
  console.log(`📝 Login credentials:`);
  console.log(`   Username: ${ADMIN_USERNAME}`);
  console.log(`   Password: ${ADMIN_PASSWORD}`);
  console.log(`🔒 Authentication: Local hardcoded credentials (no database)`);
});