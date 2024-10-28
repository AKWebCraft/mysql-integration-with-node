const express = require("express");
const dotenv = require("dotenv").config();
const mysql = require("mysql2");
// const bodyParser = require("body-parser");
const app = express();

// app.use(bodyParser);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT;

// MySQL connection setup
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Arslan.11?",
  database: "mydb",
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL");
});

// Routes

// 1. CREATE: Insert a new user into the database
app.post("/users", (req, res) => {
  const { name, email, age } = req.body;
  console.log(name,email,age)
  const query = "INSERT INTO users (name, email, age) VALUES (?, ?, ?)";

  db.query(query, [name, email, age], (err, result) => {
    if (err) {
      console.error("Error inserting user:", err);
      return res.status(500).send("Server error");
    }
    res.status(201).send("User added successfully!");
  });
});

// 2. READ: Get all users from the database
app.get("/users", (req, res) => {
  const query = "SELECT * FROM users";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).send("Server error");
    }
    res.json(results);
  });
});

// 3. READ: Get a single user by ID
app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM users WHERE id = ?";

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching user:", err);
      return res.status(500).send("Server error");
    }
    if (results.length === 0) {
      return res.status(404).send("User not found");
    }
    res.json(results[0]);
  });
});

// 4. UPDATE: Update a user’s details
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, age } = req.body;
  const query = "UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?";

  db.query(query, [name, email, age, id], (err, result) => {
    if (err) {
      console.error("Error updating user:", err);
      return res.status(500).send("Server error");
    }
    if (result.affectedRows === 0) {
      return res.status(404).send("User not found");
    }
    res.send("User updated successfully!");
  });
});

// 5. DELETE: Delete a user by ID
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM users WHERE id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting user:", err);
      return res.status(500).send("Server error");
    }
    if (result.affectedRows === 0) {
      return res.status(404).send("User not found");
    }
    res.send("User deleted successfully!");
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
