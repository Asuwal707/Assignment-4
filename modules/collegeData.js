const Sequelize = require('sequelize');
var sequelize = new Sequelize('senecadb', 'senecadb_owner', 'rE8OTeSVFuZ5', {
  host: 'ep-aged-tree-a5fu1dnm.us-east-2.aws.neon.tech',
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
    ssl: { rejectUnauthorized: false }
  },
});

// creating our data models
// our Course model

const Course = sequelize.define('Course', {
    courseId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    courseCode: Sequelize.STRING,
    courseDescription: Sequelize.STRING
});
// our student model

const Student = sequelize.define('Student', {
    studentNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressProvince: Sequelize.STRING,
    TA: Sequelize.BOOLEAN,
    status: Sequelize.STRING,
    courseId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'Courses', 
            key: 'courseId'
        },
        allowNull: true 
    }
});

// Relationship between course and student

Course.hasMany(Student, { foreignKey: 'courseId', as: 'students' });
Student.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// Initializing our database
module.exports.initialize = function () {
    // Synchronize all defined models to the database
    return sequelize.sync()
        .then(() => {
            // Log a message if synchronization is successful
            console.log('Database synchronized');
        })
        .catch(err => {
            // Log an error message if synchronization fails
            console.error('Database synchronization failed:', err);
            // Throw the error :)
            throw err; 
        });
};

// Getting all students
module.exports.getAllStudents = function () {
    return Student.findAll({
      include: [{
        model: Course,
        as: 'course',
        required: false  
      }]
    }).then(students => {
      if (students.length === 0) {
        throw new Error('No students found, Please Try Again');
      }
      return students;
    });
  };


// Getting all TAs
module.exports.getTAs = function () {
    return Student.findAll({ where: { TA: true } })
        .then(students => {
            if (students.length === 0) {
                throw new Error('No TAs found, Please Try Again');
            }
            return students;
        });
};

// Getting all courses
module.exports.getCourses = function () {
    return Course.findAll()
        .then(courses => {
            if (courses.length === 0) {
                throw new Error('No courses found');
            }
            return courses;
        });
};

// Getting student by studentNum
module.exports.getStudentByNum = function (num) {
    return Student.findByPk(num)
        .then(student => {
            if (!student) {
                throw new Error('Student not found');
            }
            return student;
        });
};

// Add a new student
module.exports.addStudent = function (studentData) {
    studentData.TA = !!studentData.TA;

    for (let prop in studentData) {
        if (studentData[prop] === "") {
            studentData[prop] = null;
        }
    }

    return Student.create(studentData)
        .catch((err) => {
            console.error('Error creating a new student:', err);
            throw new Error('Unable to add a new student');
        });
};

// Get course by courseId
module.exports.getCourseById = function (id) {
    return Course.findByPk(id)
        .then(course => {
            if (!course) {
                throw new Error('Course not found');
            }
            return course;
        });
};

// Get students by courseId
module.exports.getStudentsByCourse = function (courseId) {
    return Student.findAll({ where: { courseId: courseId } })
        .then(students => {
            if (students.length === 0) {
                throw new Error('No students found for this course');
            }
            return students;
        });
};

// Update student details
module.exports.updateStudent = function (studentData) {
    studentData.TA = !!studentData.TA;

    for (let prop in studentData) {
        if (studentData[prop] === "") {
            studentData[prop] = null;
        }
    }
    if (!studentData.courseId) {
        studentData.courseId = null;
    }

    return Student.update(studentData, { where: { studentNum: studentData.studentNum } })
        .then(([affectedCount]) => {
            if (affectedCount === 0) {
                throw new Error('Could not update student details');
            }
        });
};

// Adding course
module.exports.addCourse = function (courseData) {
    for (let prop in courseData) {
      if (courseData[prop] === "") {
        courseData[prop] = null;
      }
    }
  
    return Course.create(courseData)
      .then(newCourse => {
        console.log('New course created:', newCourse.toJSON());
        return newCourse;
      })
      .catch(error => {
        console.error('Error creating course:', error);
        throw new Error('Unable to create course');
      });
  };
// Updating the course details
module.exports.updateCourse = function (courseData) {
    for (let prop in courseData) {
        if (courseData[prop] === "") {
            courseData[prop] = null;
        }
    }

    return Course.update(courseData, { where: { courseId: courseData.courseId } })
        .then(([affectedCount]) => {
            if (affectedCount === 0) {
                throw new Error('Unable to update the course');
            }
        });
};
// Delete student
module.exports.deleteStudentByNum = function (studentNum) {
    return Student.destroy({ where: { studentNum: studentNum } })
        .then(affectedCount => {
            if (affectedCount === 0) {
                throw new Error('Student not found, please enter valid student details');
            }
        });
};

// Delete course
module.exports.deleteCourseById = function (id) {
    return Course.destroy({ where: { courseId: id } })
        .then(affectedCount => {
            if (affectedCount === 0) {
                throw new Error('Course not found, please enter valid course details');
            }
        });
};

