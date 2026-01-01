const express = require("express"); // 1. Import the whole module
const studentData = require('./studentData.json')
const cors = require('cors')
const app = express(); // 2. Initialize the app
const port = 5000;

app.use(cors())

app.get('/', (req, res) => {
    res.send("Hello world, i am here");
});

app.get('/studentData', (req, res) =>{
    console.log(studentData)
    res.send(studentData);
})

app.get('/studentData/:id', (req, res) =>{
    const id = parseInt(req.params.id);
    // const user = studentData.find( studentInfo => console.log(studentInfo.id, id) )
    const user = studentData.find( studentInfo => studentInfo.id === id )
    res.send(user)
})


//---------------------------------------------------------
// 3. Use .listen(), not .listenerCount()
app.listen(port, () => {
    console.log(`My server is running on ${port}`);
});