const fs = require("fs");

class Data {
    constructor(students, courses) {
        this.students = students;
        this.courses = courses;
    }
}

let dataCollection = null;

// Initialize data by reading JSON files
module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        fs.readFile('./data/courses.json', 'utf8', (err, courseData) => {
            if (err) {
                reject("unable to load courses");
                return;
            }

            fs.readFile('./data/students.json', 'utf8', (err, studentData) => {
                if (err) {
                    reject("unable to load students");
                    return;
                }

                dataCollection = new Data(JSON.parse(studentData), JSON.parse(courseData));
                resolve();
            });
        });
    });
}

// Get all students
module.exports.getAllStudents = function () {
    return new Promise((resolve, reject) => {
        if (dataCollection.students.length === 0) {
            reject("query returned 0 results");
            return;
        }

        resolve(dataCollection.students);
    });
}

// Get all courses
module.exports.getCourses = function () {
    return new Promise((resolve, reject) => {
        if (dataCollection.courses.length === 0) {
            reject("query returned 0 results");
            return;
        }

        resolve(dataCollection.courses);
    });
};

// Get a student by their student number
module.exports.getStudentByNum = function (num) {
    return new Promise((resolve, reject) => {
        let foundStudent = null;

        for (let i = 0; i < dataCollection.students.length; i++) {
            if (dataCollection.students[i].studentNum == num) {
                foundStudent = dataCollection.students[i];
                break;
            }
        }

        if (!foundStudent) {
            reject("query returned 0 results");
            return;
        }

        resolve(foundStudent);
    });
};

// Get students by course
module.exports.getStudentsByCourse = function (course) {
    return new Promise((resolve, reject) => {
        const filteredStudents = dataCollection.students.filter(student => student.course == course);

        if (filteredStudents.length === 0) {
            reject("query returned 0 results");
            return;
        }

        resolve(filteredStudents);
    });
};

// Add a new student
module.exports.addStudent = function (requestBody) {
    return new Promise((resolve, reject) => {
        try {
            requestBody.studentNum = dataCollection.students.length + 1;
            requestBody.TA = requestBody.TA ? true : false;
            dataCollection.students.push(requestBody);
            resolve("Student Added");
        } catch (err) {
            reject(err);
        }
    });
};

// Update an existing student
module.exports.updateStudent = function (requestBody) {
    return new Promise((resolve, reject) => {
        try {
            let studentIndex = dataCollection.students.findIndex(student => student.studentNum == requestBody.studentNum);

            if (studentIndex === -1) {
                reject("Invalid Student ID");
                return;
            }

            requestBody.TA = requestBody.TA ? true : false;
            dataCollection.students[studentIndex] = requestBody;
            resolve("Student Updated");
        } catch (err) {
            reject(err);
        }
    });
};

// Get a course by its ID
module.exports.getCourseById = function (id) {
    return new Promise((resolve, reject) => {
        const course = dataCollection.courses.find(course => course.courseId == id);

        if (course) {
            resolve(course);
        } else {
            reject("query returned 0 results");
        }
    });
};
