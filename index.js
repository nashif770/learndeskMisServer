const { user, pass } = require("./user");
const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");

const app = express();
const port = 5000;

// ----------------- Middleware -----------------
app.use(cors());
app.use(express.json());

// ---------------- MongoDB ---------------------
const uri = `mongodb+srv://${user}:${pass}@learndesk.djnqq4s.mongodb.net/?appName=LearnDesk`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let studentCollection; // ✅ global reference

async function startServer() {
  try {
    await client.connect();
    console.log("✅ MongoDB connected");

    const db = client.db("learnDeskMis");
    studentCollection = db.collection("studentDB");

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

    const users = [];

    app.post("/userData", (req, res) => {
      const user = req.body;

      if (!user.uid || !user.email) {
        return res.status(400).json({ message: "UID and email required" });
      }

      users.push(user);
      res.status(201).json({ message: "User saved", user });
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
