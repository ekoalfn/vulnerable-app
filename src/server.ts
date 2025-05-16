import express from 'express';
import cors from 'cors';
import { mockAPI } from './mockBackend';

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.post('/api/users/change-password-vulnerable', async (req, res) => {
  try {
    const { newPassword } = req.body;
    const result = await mockAPI.users.changePasswordVulnerable(newPassword);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// New CSRF-vulnerable endpoints
app.post('/api/users/change-password', async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    // No CSRF token validation
    const result = await mockAPI.users.changePassword(oldPassword || 'password123', newPassword);
    res.json({
      success: true,
      message: 'Password changed successfully (VULNERABLE to CSRF)',
      data: result
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/users/profile', async (req, res) => {
  try {
    const data = req.body;
    // No CSRF token validation
    const result = await mockAPI.users.updateProfile(data);
    res.json({
      success: true,
      message: 'Profile updated successfully (VULNERABLE to CSRF)',
      user: result
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Vulnerable server running at http://localhost:${port}`);
}); 