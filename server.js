// Import Express framework
const express = require("express");

// Create Express application
const app = express();
const PORT = 3000;

// Middleware to serve static frontend files and read JSON requests
app.use(express.static("public"));
app.use(express.json());

// Temporary in-memory ticket data used for demonstration
let tickets = [
  { id: 1, match: "Arsenal vs Chelsea", price: 120, location: "London" },
  { id: 2, match: "Barcelona vs Real Madrid", price: 200, location: "Barcelona" },
  { id: 3, match: "AC Milan vs Inter", price: 150, location: "Milan" }
];

// Temporary in-memory user storage for prototype login and registration
let users = [];

// Returns all available tickets for display on the homepage
app.get("/tickets", (req, res) => {
  res.json(tickets);
});

// Adds a new ticket to the system
app.post("/tickets", (req, res) => {
  const { match, price, location } = req.body;

  if (!match || !price || !location) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const newTicket = {
    id: tickets.length > 0 ? Math.max(...tickets.map(t => t.id)) + 1 : 1,
    match,
    price: Number(price),
    location
  };

  tickets.push(newTicket);
  res.status(201).json(newTicket);
});

// Deletes a ticket through its unique ID
app.delete("/tickets/:id", (req, res) => {
  const ticketId = Number(req.params.id);
  const initialLength = tickets.length;

  tickets = tickets.filter(ticket => ticket.id !== ticketId);

  if (tickets.length === initialLength) {
    return res.status(404).json({ message: "Ticket not found" });
  }

  res.json({ message: "Ticket deleted successfully" });
});

// Registers a new user for the prototype system
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingUser = users.find(user => user.email === email);

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
    password
  };

  users.push(newUser);

  res.status(201).json({
    message: "Registration successful",
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email
    }
  });
});

// Does the log in of user by verifying email and password
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = users.find(
    user => user.email === email && user.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  res.json({
    message: "Login successful",
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
});

// Starts the local development server
app.listen(PORT, () => {
  console.log(`BallPass server running at http://localhost:${PORT}`);
});