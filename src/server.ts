import express from 'express';
import cors from 'cors';
import { mockAPI } from './mockBackend';

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

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

// Start server
app.listen(port, () => {
  console.log(`Vulnerable server running at http://localhost:${port}`);
}); 