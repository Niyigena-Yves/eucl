const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Configure MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '235711',
  database: 'eucl_tokens_db',
});

// Establish MySQL connection
connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL: ', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Handle MySQL connection errors
connection.on('error', err => {
  console.error('MySQL connection error: ', err);
});

// Middleware
app.use(bodyParser.json());

// Generate a token
app.post('/api/generateToken', (req, res) => {
  const { amount, meterNumber } = req.body;

  if (!amount || !meterNumber) {
    return res.status(400).json({ error: 'Amount and meter number are required' });
  }

  if (!/^\d{6}$/.test(meterNumber)) {
    return res.status(400).json({ error: 'Meter number should be 6 digits' });
  }

  const amountNumber = parseInt(amount);
  if (isNaN(amountNumber) || amountNumber < 100) {
    return res.status(400).json({ error: 'Amount should be at least 100 Rwf' });
  }

  const tokenValidityDays = Math.floor(amountNumber / 100);
  if (tokenValidityDays > 1825) {
    return res.status(400).json({ error: 'Amount should not exceed 5 years (1825 days)' });
  }

  const token = generateToken();
  const tokenStatus = 'NEW';
  const tokenValueDays = tokenValidityDays;

  const purchasedToken = {
    meter_number: meterNumber,
    token,
    token_status: tokenStatus,
    token_value_days: tokenValueDays,
  };

  // Save the purchased token to the database
  connection.query('INSERT INTO purchased_tokens SET ?', purchasedToken, (err, results) => {
    if (err) {
      console.error('Error inserting token into database: ', err);
      return res.status(500).json({ error: 'An error occurred while generating the token' });
    }

    return res.status(200).json({ token, tokenValidityDays });
  });
});

// Validate a token
app.post('/api/validateToken', (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  connection.query(
    'SELECT token_value_days FROM purchased_tokens WHERE token = ?',
    [token],
    (err, results) => {
      if (err) {
        console.error('Error validating token: ', err);
        return res.status(500).json({ error: 'An error occurred while validating the token' });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'Token not found' });
      }

      const tokenValidityDays = results[0].token_value_days;
      return res.status(200).json({ tokenValidityDays });
    }
  );
});

// Get all tokens for a meter number
app.get('/api/getTokens/:meterNumber', (req, res) => {
  const { meterNumber } = req.params;

  if (!/^\d{6}$/.test(meterNumber)) {
    return res.status(400).json({ error: 'Meter number should be 6 digits' });
  }

  connection.query(
    'SELECT token, token_value_days FROM purchased_tokens WHERE meter_number = ?',
    [meterNumber],
    (err, results) => {
      if (err) {
        console.error('Error retrieving tokens: ', err);
        return res.status(500).json({ error: 'An error occurred while retrieving tokens' });
      }

      return res.status(200).json({ tokens: results });
    }
  );
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Helper function to generate an 8-digit token
const generateToken = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters[randomIndex];
  }
  return token;
};
