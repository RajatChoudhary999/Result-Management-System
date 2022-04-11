const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const request = require("request");
const ejs = require("ejs");


const app = express();

app.set("view engine", 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

// Database Connection
require("./src/database/connection");

// API calls
var { addRecord, getDetails, login, getAllRecords, editRecord, deleteRecord } = require("./src/api");
// const { rmSync } = require("fs");

// GET ROUTES

app.get("/", (req, res) => {
   res.render("home", { loggedIn: false });
});

app.get("/teacherLogin", (req, res) => {
   res.render("login", { who: "Teacher", loggedIn: false });
});

app.get("/studentLogin", (req, res) => {
   res.render("login", { who: "Student", loggedIn: false });
});

// app.get("/teacherDashboard/:list", (req, res) => {
//    let students = JSON.parse(req.params.list);
//    res.render("allRecords", {students : students});
// });

app.get("/teacherDashboard", async (req, res) => {
   let students = await getAllRecords();
   res.render("allRecords", { students: students, count: students.length, loggedIn: true });
});

app.get("/addRecord", (req, res) => {
   res.render("addRecord", { loggedIn: true });
});

app.get("/editRecord/:roll", async (req, res) => {
   res.render("editRecord", { roll: req.params.roll, loggedIn: true });
});

app.get("/deleteRecord/:roll", async (req, res) => {
   await deleteRecord(req.params.roll);
   res.redirect("/teacherDashboard");
});

app.get("/findResult/:name", (req, res) => {
   res.render("findResult", { loggedIn: true, name:req.params.name });
});

app.get("/result/:roll/:name/:dob/:score", (req, res) => {
   const result = {
      roll: req.params.roll,
      name: req.params.name,
      dob: req.params.dob,
      score: req.params.score
   }
   res.render("result", { resultSet: result, loggedIn: true });
});

app.get("/error/:msg", (req, res) => {
   let msg = req.params.msg;
   res.render("errorPage", { message: msg });
});



// POST ROUTES

app.post("/login/:who", async (req, res) => {
   if (req.params.who == "Teacher") {
      let { username, password } = req.body;
      // console.log(username +" "+ password);
      if (username == "rajat04" && password == "admin123") {
         // let list=JSON.stringify(students);
         res.redirect("/teacherDashboard");
      } else {
         res.redirect("/error/Invalid Login Credentials!!");
      }
   } else if (req.params.who == "Student") {
      let { roll, dob } = req.body;
      const stud = await login(roll, dob);
      if (stud != null) {
         res.redirect(`/findResult/${stud.name}`);
      } else {
         res.redirect("/error/Invalid Login Credentials!!");
      }
   }
});

app.post("/addNewRecord", async (req, res) => {
   let { roll, name, dob, score } = req.body;
   // console.log(roll);
   await addRecord(roll, name, dob, score);
   res.redirect("/teacherDashboard");
});

app.post("/findResult", async (req, res) => {
   let { roll, name } = req.body;
   const result = await getDetails(roll, name);
   if (result != null) {
      // res.render("result");
      res.redirect(`/result/${result.roll}/${result.name}/${result.dob}/${result.score}`);
   } else {
      res.redirect("/error/Invalid Details!");
   }
});

app.post("/editRecord", async (req, res) => {
   let { roll, name, dob, score } = req.body;
   await editRecord(roll, name, dob, score);
   res.redirect("/teacherDashboard");
});

app.post("/logout", (req, res) => {
   res.redirect("/");
});



// Listening on port
app.listen(3000, () => {
   console.log("Server is running on Port : 3000");
});