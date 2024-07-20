/*********************************************************************************
*  WEB700 – Assignment 05
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
*  of this assignment has been copied manually or electronically from any other source
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: aashish Student ID: 161760236 Date:7/20/2024
*
********************************************************************************/

const express = require('express');
const path = require('path');
const collegeData = require('./modules/collegeData');
const exphbs = require('express-handlebars');

const app = express();
const HTTP_PORT = process.env.PORT || 8080; // this is our server port 

// initializing express app
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));

// handlebar helpers and fixing nav bar
app.engine('.hbs', exphbs.engine({ 
  extname: '.hbs',
  helpers: { 
      navLink: function(url, options){
          return '<li' + 
              ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') + 
              '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
      },
      equal: function (lvalue, rvalue, options) {
          if (arguments.length < 3)
              throw new Error("Handlebars Helper equal needs 2 parameters");
          if (lvalue != rvalue) {
              return options.inverse(this);
          } else {
              return options.fn(this);
          }
      }           
  }
}));
app.set('view engine', '.hbs');

//middleware function for nav bar
app.use(function(req, res, next){
  let route = req.path.substring(1);
  app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));    
  next();
});

//new route
app.get("/", (req, res) => {
  res.render('home', { layout: 'main' });
});

app.get("/about", (req, res) => {
  res.render('about', { layout: 'main' });
});

app.get("/htmlDemo", (req, res) => {
  res.render('htmlDemo', { layout: 'main' });
});

app.get('/students/add', (req, res) => {
  res.render('addStudent');
});

app.post("/students/add", (req, res) => {
  collegeData.addStudent(req.body)
    .then(() => {
      res.redirect("/students");
    })
    .catch((error) => {
      console.error(error.message);
      res.status(500).send(`<script>alert('Something Went Wrong'); window.location.href = '/students/add';</script>`);
    });
});

// hbs config
app.set('view engine', '.hbs');

// new route for getting students
app.get("/students", (req, res) => {
  if (req.query && req.query.course) {
    collegeData.getStudentsByCourse(req.query.course)
      .then((students) => {
        res.render("students", { data: students });
      })
      .catch((err) => {
        console.error(err.message);
        res.render("students", { message: "No Results" });
      });
  } else {
    collegeData.getAllStudents()
      .then((students) => {
        res.render("students", { data: students });
      })
      .catch((err) => {
        console.error(err.message);
        res.render("students", { message: "No Results" });
      });
  }
});

// route for individual students
app.get('/student/:studentNum', (req, res) => {
  const studentNum = req.params.studentNum;
  collegeData.getStudentByNum(studentNum)
    .then((student) => {
      if (student) {
        res.render('student', { student });
      } else {
        res.render('student', { message: "Student not found" });
      }
    })
    .catch((err) => {
      console.error(err.message);
      res.render('student', { message: "Error retrieving student" });
    });
});

// getting all courses (updated for hbs)
app.get("/courses", (req, res) => {
  collegeData.getCourses()
    .then((data) => {
      res.render("courses", { courses: data });
    })
    .catch((err) => {
      console.error(err.message);
      res.render("courses", { message: "No Results" });
    });
});

// Get route for individual courses
app.get('/course/:courseId', (req, res) => {
  const courseId = req.params.courseId;
  collegeData.getCourseById(courseId)
    .then((course) => {
      if (course) {
        res.render('course', { course });
      } else {
        res.render('course', { message: "Course not found" });
      }
    })
    .catch((err) => {
      console.error(err.message);
      res.render('course', { message: "Error retrieving course" });
    });
});

// getting a specific student by their number
app.get("/student/:num", (req, res) => {
  collegeData.getStudentByNum(req.params.num)
    .then((data) => {
      res.json(data); // sending student data as json
    })
    .catch((err) => {
      console.error(err.message);
      res.json({ message: "No Results" });
    });
});

// this is our middleware used to handle 404 errors
app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

// initialize the module and start server on port
collegeData.initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`Server listening on port: ${HTTP_PORT}`); // message pops when server starts on the port
    });
  })
  .catch((err) => {
    console.error(err.message);
  });

module.exports = app;
