const fs = require("fs");

class Data{
    constructor(students, courses){
        this.students = students;
        this.courses = courses;
    }
}

let dataCollection = null;

module.exports.initialize = function () {
    return new Promise( (resolve, reject) => {
        fs.readFile('./data/courses.json','utf8', (err, courseData) => {
            if (err) {
                reject("Unable to load courses"); return;
            }

            fs.readFile('./data/students.json','utf8', (err, studentData) => {
                if (err) {
                    reject("Unable to load students"); return;
                }

                dataCollection = new Data(JSON.parse(studentData), JSON.parse(courseData));
                resolve(dataCollection.students.length);
            });
        });
    });
}



// function to get all students
module.exports.getAllStudents = function(){
    return new Promise((resolve,reject)=>{
        if (dataCollection.students.length == 0) {
            reject("no students"); return;
        }

        resolve(dataCollection.students);
    })
}

module.exports.getCourses = function(){
   return new Promise((resolve,reject)=>{
    if (dataCollection.courses.length == 0) {
        reject("no course found"); return;
    }
    resolve(dataCollection.courses);
   });
};

module.exports.getCourseById = function(num){
    return new Promise((resolve,reject)=>{
        var foundCourse = null;
        for (let i = 0; i < dataCollection.courses.length; i++) {
            if (dataCollection.courses[i].courseId == num) {
                foundCourse = dataCollection.courses[i];
            }
        }
        if (!foundCourse) {
            reject("no students for thius course"); return;
        }
        resolve(foundCourse);
    });
 };

module.exports.getStudentByNum = function(num) {
    return new Promise(function (resolve, reject) {
        var foundStudent = null;
        for (let i = 0; i < dataCollection.students.length; i++) {
            if (dataCollection.students[i].studentNum == num) {
                foundStudent = dataCollection.students[i];
            }
        }

        if (!foundStudent) {
            reject("no student by this numb"); return;
        }

        resolve(foundStudent);
    });
};

module.exports.getStudentsByCourse = function (course) {
    return new Promise(function (resolve, reject) {
        var filteredStudents = [];

        for (let i = 0; i < dataCollection.students.length; i++) {
            if (dataCollection.students[i].course == course) {
                filteredStudents.push(dataCollection.students[i]);
            }
        }

        if (filteredStudents.length == 0) {
            reject("no students on this course"); return;
        }

        resolve(filteredStudents);
    });
};
// function to adds students
module.exports.addStudent = function (requestBody) {
    return new Promise(function (resolve, reject) {
        try {
            requestBody.studentNum = dataCollection.students.length + 1;
            if(requestBody.TA === undefined)
                requestBody.TA = false;
            else
                requestBody.TA = true;
                dataCollection.students.push(requestBody);
            resolve("Student Added succesfully ");
        } catch (err) {
            console.log(err)
            reject(err);
        }
    });
};

module.exports.updateStudent = function (requestBody) {
    return new Promise(function (resolve, reject) {
        try {
            var studentIndex = null;
            for (let i = 0; i < dataCollection.students.length; i++) {
                if (dataCollection.students[i].studentNum == requestBody.studentNum) {
                    studentIndex = i;
                    break;
                }
            }
            if(studentIndex == null) {
                reject("Invalid Student ID"); return;
            }
            if(requestBody.TA === undefined)
                requestBody.TA = false;
            else
                requestBody.TA = true;
                dataCollection.students[studentIndex] = requestBody;
            resolve("Student Updated succesfully");
        } catch (err) {
            console.log(err)
            reject(err);
        }
    });
};