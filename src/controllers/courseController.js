const Course = require('../models/Course');

const moment = require('moment');

const createCourse = async (req, res) => {
    const { title, description, startDate, endDate } = req.body;
    
    // Parse date strings
    const parsedStartDate = moment(startDate, 'DD-MM-YYYY').toDate();
    const parsedEndDate = moment(endDate, 'DD-MM-YYYY').toDate();
    
    const course = new Course({
        title,
        description,
        teacherId: req.user._id,
        startDate: parsedStartDate,
        endDate: parsedEndDate,
    });

    try {
        const createdCourse = await course.save();
        res.status(201).json(createdCourse);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const getCourses = async (req, res) => {
    const courses = await Course.find({}).populate('teacherId', 'username');
    res.json(courses);
};

const updateCourse = async (req, res) => {
    const { title, description } = req.body;
    const course = await Course.findById(req.params.id);

    if (course) {
        course.title = title || course.title;
        course.description = description || course.description;
        const updatedCourse = await course.save();
        res.json(updatedCourse);
    } else {
        res.status(404).json({ message: 'Course not found' });
    }
};
const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);

        if (course) {
            res.json({ message: 'Course removed' });
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = { createCourse, getCourses, updateCourse, deleteCourse };