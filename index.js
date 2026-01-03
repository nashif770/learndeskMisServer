const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
require('dotenv').config();

const app = express();
const port = 5000;

// ----------------- Middleware -----------------
app.use(cors());
app.use(express.json());

// ---------------- MongoDB ---------------------
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@learndesk.djnqq4s.mongodb.net/?appName=LearnDesk`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function startServer() {
  try {
    await client.connect();
    console.log("✅ MongoDB connected");

    const database = client.db("learnDeskMis");
    const studentCollection = database.collection("studentDB");
    const userCollection = database.collection("userDB");

    // ---------------- Routes -----------------

    app.get("/", (req, res) => {
      res.send("Server is running");
    });

    // ---------------- Students ----------------

    app.get("/studentData", async (req, res) => {
      const students = await studentCollection.find().toArray();
      res.send(students);
    });

    app.get("/studentData/:id", async (req, res) => {
      const id = req.params.id;
      const student = await studentCollection.findOne({ _id: id });
      res.send(student);
    });

    app.post("/studentData", async (req, res) => {
      try {
        const newStudent = req.body;
        console.log("📥 Received student:", newStudent);
        const result = await studentCollection.insertOne(newStudent);
        res.status(201).json({
          success: true,
          insertedId: result.insertedId,
          data: newStudent,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to add student" });
      }
    });

    // ---------------- Users -------------------

    app.post("/userData", async (req, res) => {
      try {
        const newUser = req.body;
        console.log("📥 Received student:", newUser);
        const result = await userCollection.insertOne(newUser);
        res.status(201).json({
          success: true,
          insertedId: result.insertedId,
          data: newUser,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to add User" });
      }
    });

    // ---------------- Start Server -------------
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  } catch (error) {
    console.error("❌ Server failed to start", error);
  }
}

startServer();
