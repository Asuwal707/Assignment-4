const fs = require("fs");
const path = require("path");

class Data {
    constructor(students, courses) {
        this.students = students;
        this.courses = courses;
    }
}

let dataCollection = null;

// Function to initialize data from JSON files
module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        // Read courses data
        fs.readFile(path.join(__dirname, 'data', 'courses.json'), 'utf8', (err, courseData) => {
            if (err) {
                reject("Unable to load courses");
                return;
            }

            // Read students data
            fs.readFile(path.join(__dirname, 'data', 'students.json'), 'utf8', (err, studentData) => {
                if (err) {
                    reject("Unable to load students");
                    return;
                }

                // Parse JSON data and create Data object
                dataCollection = new Data(JSON.parse(studentData), JSON.parse(courseData));
                resolve();
            });
        });
    });
}

// Function to get all students
module.exports.getAllStudents = function() {
    return new Promise((resolve, reject) => {
        if (dataCollection.students.length === 0) {
            reject("No students found");
            return;
        }
        resolve(dataCollection.students);
    });
}

// Function to get all courses
module.exports.getCourses = function() {
    return new Promise((resolve, reject) => {
        if (dataCollection.courses.length === 0) {
            reject("No courses found");
            return;
        }
        resolve(dataCollection.courses);
    });
}

// Function to get a student by their number
module.exports.getStudentByNum = function(num) {
    return new Promise((resolve, reject) => {
        const student = dataCollection.students.find(s => s.studentNum == num);
        if (!student) {
            reject("Student not found");
            return;
        }
        resolve(student);
    });
};

// Function to get students by course
module.exports.getStudentsByCourse = function(course) {
    return new Promise((resolve, reject) => {
        const filteredStudents = dataCollection.students.filter(s => s.course === course);
        if (filteredStudents.length === 0) {
            reject("No students found for this course");
            return;
        }
        resolve(filteredStudents);
    });
};

// Function to add a new student
module.exports.addStudent = function(requestBody) {
    return new Promise((resolve, reject) => {
        try {
            requestBody.studentNum = dataCollection.students.length + 1;
            requestBody.TA = requestBody.TA === undefined ? false : true;
            dataCollection.students.push(requestBody);

            // Save updated students data to JSON file
            fs.writeFile(path.join(__dirname, 'data', 'students.json'), JSON.stringify(dataCollection.students, null, 2), (err) => {
                if (err) {
                    reject("Unable to save student data");
                    return;
                }
                resolve("Student Added");
            });
        } catch (err) {
            reject(err);
        }
    });
};

// Function to update an existing student
module.exports.updateStudent = function(requestBody) {
    return new Promise((resolve, reject) => {
        try {
            const studentIndex = dataCollection.students.findIndex(s => s.studentNum == requestBody.studentNum);
            if (studentIndex === -1) {
                reject("Student not found");
                return;
            }
            requestBody.TA = requestBody.TA === undefined ? false : true;
            dataCollection.students[studentIndex] = requestBody;

            // Save updated students data to JSON file
            fs.writeFile(path.join(__dirname, 'data', 'students.json'), JSON.stringify(dataCollection.students, null, 2), (err) => {
                if (err) {
                    reject("Unable to save student data");
                    return;
                }
                resolve("Student Updated");
            });
        } catch (err) {
            reject(err);
        }
    });
};

// Function to get a course by ID
module.exports.getCourseById = function(id) {
    return new Promise((resolve, reject) => {
        const course = dataCollection.courses.find(c => c.courseId == id);
        if (!course) {
            reject("Course not found");
            return;
        }
        resolve(course);
    });
};
