const express = require("express"); // 1. Import the whole module
const studentData = require("./studentData.json");
const userData = require("./userData.json");
const cors = require("cors");
const app = express(); // 2. Initialize the app
const port = 5000;

app.use(cors());
app.use(express.json());

let users = []; // replace with real DB later

app.get("/", (req, res) => {
  res.send("You have tried to enter the hole");
});
// ------------------ Students --------------------
app.get("/studentData", (req, res) => {
    // console.log(studentData)
    res.send(studentData);
});

app.get("/studentData/:id", (req, res) => {
  const id = parseInt(req.params.id);
  // const user = studentData.find( studentInfo => console.log(studentInfo.id, id) )
  const user = studentData.find((studentInfo) => studentInfo.id === id);
  res.send(user);
});

app.post("/studentData", (req, res) => {
    const student = req.body;
    
  console.log("Received student data:", student);
  
  // Example: store in array
  studentData.push(student);

  res.status(201).json({
      message: "Student data received successfully",
      data: student,
    });
});
// ------------------ Students --------------------

app.get("/studentData", (req, res) => {
    // console.log(studentData)
    res.send(studentData);
});

//------------------- UserData -------------------


app.post("/userData", (req, res) => {
  const user = req.body;

  if (!user.uid || !user.email) {
    return res.status(400).json({ message: "UID and email required" });
  }

  // store user (in real app, use DB)
  users.push(user);

  res.status(201).json({ message: "User saved", user });
});

app.get("/userData", (req, res) => {
    // console.log(studentData)
    res.send(userData);
});

//------------------- UserData -------------------

//---------------------------------------------------------
// 3. Use .listen(), not .listenerCount()
app.listen(port, () => {
  console.log(`My server is running on ${port}`);
});
