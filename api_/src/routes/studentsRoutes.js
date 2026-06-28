const express = require('express');
const router = express.Router();

// Mock students data
let students = [
  { id: 1, name: "Student One", course: "Computer Science" },
  { id: 2, name: "Student Two", course: "Information Systems" }
];

router.get('/', (req, res) => {
  res.json(students);
});

router.post('/', (req, res) => {
  const newStudent = { id: students.length + 1, ...req.body };
  students.push(newStudent);
  res.status(201).json(newStudent);
});

module.exports = router;
