const express = require('express');
const cors = require('cors');
const path = require('path');

// Mock API for demo
const mockAPI = {
  users: {
    changePassword: (oldPassword, newPassword) => {
      console.log(`Password changed from ${oldPassword} to ${newPassword}`);
      return { message: 'Password changed successfully' };
    },
    changePasswordVulnerable: (newPassword) => {
      console.log(`Password changed to ${newPassword} (vulnerable method)`);
      return { 
        success: true,
        message: 'Password changed successfully (VULNERABLE!)',
        newPassword: newPassword 
      };
    },
    updateProfile: (data) => {
      console.log('Profile updated with:', data);
      return {
        id: '1',
        name: 'Test User',
        email: data.email || 'updated@example.com',
        bio: data.bio || 'Updated bio',
        website: data.website || 'https://example.com/updated'
      };
    }
  }
};

const app = express();
const port = 3100;

// Middleware
app.use(cors({
  origin: '*',  // Allowing all origins for demo
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Body:', req.body);
  next();
});

// Routes
app.post('/api/users/change-password-vulnerable', async (req, res) => {
  try {
    const { newPassword } = req.body;
    const result = mockAPI.users.changePasswordVulnerable(newPassword);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// New CSRF-vulnerable endpoints
app.post('/api/users/change-password', async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    // No CSRF token validation
    console.log(`Attempting to change password from ${oldPassword} to ${newPassword}`);
    const result = mockAPI.users.changePassword(oldPassword || 'password123', newPassword);
    
    res.json({
      success: true,
      message: 'Password changed successfully (VULNERABLE to CSRF)',
      data: result
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/users/profile', async (req, res) => {
  try {
    const data = req.body;
    console.log('Profile update request received:', data);
    // No CSRF token validation
    const result = mockAPI.users.updateProfile(data);
    
    res.json({
      success: true,
      message: 'Profile updated successfully (VULNERABLE to CSRF)',
      user: result
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(400).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Vulnerable server is running' });
});

// Start server
app.listen(port, () => {
  console.log(`Vulnerable server running at http://localhost:${port}`);
}); 