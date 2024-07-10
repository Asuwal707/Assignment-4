/*********************************************************************************
*  WEB700 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
*  of this assignment has been copied manually or electronically from any other source
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: aashish Student ID: 161760236 Date:6/15/2024
*
********************************************************************************/

// importing the modules
const express = require('express');
const path = require('path');
const collegeData = require('./modules/collegeData');
//
//importing public css





// initializing express app
const app = express();
const HTTP_PORT = process.env.PORT || 8080; // this is our server port 
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/home.html")); //route for our home page
});
// about page
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/about.html"));
});

// html demo page
app.get("/htmlDemo", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/htmlDemo.html"));
});
// addstudents page
app.get("/students/add", (req, res) => {
  console.log('This is working');
  res.sendFile(path.join(__dirname, "/views/addStudent.html"));
});

// getting all the students
app.get("/students", (req, res) => {
  if (req.query.course) {
    collegeData.getStudentsByCourse(req.query.course).then((data) => {
      res.json(data); // sending student data which is filtered
    }).catch((err) => {
      res.json({message: "no results"}); // response for rejected promise
    });
  } else {
    collegeData.getAllStudents().then((data) => {
      res.json(data); // send all student data as json
    }).catch((err) => {
      res.json({message: "no results"});
    });
  }
});
// getting all TAs
app.get("/tas", (req, res) => {
  collegeData.getTAs().then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json({message: "no results"});
  });
});
// getting all courses
app.get("/courses", (req, res) => {
  collegeData.getCourses().then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json({message: "no results"});
  });
});
// getting a specific student by their number
app.get("/student/:num", (req, res) => {
  collegeData.getStudentByNum(req.params.num).then((data) => {
    res.json(data); // sending studemt data as json
  }).catch((err) => {
    res.json({message: "no results"});
  });
});

// adding the students 
app.post("/students/add", (req, res) => {
  collegeData.addStudent(req.body).then(() => {
    res.redirect("/students");
  }).catch((err) => {
    res.status(500).send("Unable to add student");
  });
});

// this is our middleware ued to handle 404 errors.
app.use((req, res) => {
  res.status(404).send("Page Not Found");
});
// initilize the module and and starting server on port 
collegeData.initialize().then(() => {
  app.listen(HTTP_PORT, () => {
    console.log(`Server listening on port: ${HTTP_PORT}`); // message pops when server starts on the port
  });
}).catch((err) => {
  console.log(err);
});
