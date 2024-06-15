const fs = require('fs'); // getting the filesystem

let students = [];
let courses = [];

const initialize = () => {
  return new Promise((resolve, reject) => {
    fs.readFile('./data/students.json', (err, data) => {
      if (err) {
        reject('Unable to load students data');
      } else {
        students = JSON.parse(data);
        fs.readFile('./data/courses.json', (err, data) => {
          if (err) {
            reject('Unable to load courses data');
          } else {
            courses = JSON.parse(data);
            resolve();
          }
        });
      }
    });
  });
};

/// get students by course: our function will provide and array of students whose coruse properlt match the course parameter.
const getStudentsByCourse = (course) => {
  return new Promise((resolve, reject) => {
    const filteredStudents = students.filter(s => s.course === course);
    if (filteredStudents.length > 0) {
      resolve(filteredStudents);
    } else {
      reject('No results returned');
    }
  });
};

// getting students by number.
const getStudentByNum = (num) => {
  return new Promise((resolve, reject) => {
    const student = students.find(s => s.studentNum === num);
    if (student) {
      resolve(student);
    } else {
      reject('No results returned');
    }
  });
};

module.exports = {
    initialize,
  getStudentsByCourse,
  getStudentByNum
};
