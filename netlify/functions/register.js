const sqlite3 = require('sqlite3').verbose();
const path = require('path');

exports.handler = async (event, context) => {
  // Ensure the request method is POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  // Parse the request body
  const { fullName, email, mobileNumber, password } = JSON.parse(event.body);

  // Check if all fields are provided
  if (!fullName || !email || !mobileNumber || !password) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'All fields are required' }),
    };
  }

  // Path to the SQLite3 database file
  const dbPath = path.resolve(__dirname, 'usersDB.db');
  
  // Connect to the SQLite3 database
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Internal Server Error' }),
      };
    }
  });
  // Promisify SQLite3 to use async/await
  const runQuery = (query, params = []) =>
    new Promise((resolve, reject) => {
      db.run(query, params, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this);
        }
      });
    });

  const getQuery = (query, params = []) =>
    new Promise((resolve, reject) => {
      db.get(query, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });

  try {
    // Check if the email already exists
    const userExists = await getQuery('SELECT * FROM users WHERE email = ?', [email]);

    if (userExists) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'User with this email already exists' }),
      };
    }

    // Insert the new user into the database
    await runQuery(
      'INSERT INTO users (fullName, email, mobileNumber, password) VALUES (?, ?, ?, ?)',
      [fullName, email, mobileNumber, password]
    );

    // Close the database connection
    db.close();

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'User registered successfully' }),
    };
  } catch (error) {
    console.error('Error registering user:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
