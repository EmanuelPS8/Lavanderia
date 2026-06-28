const express = require('express');
const router = express.Router();

// Mock teachers data
let teachers = [
  { id: 1, name: "Teacher One", department: "Computer Science" },
  { id: 2, name: "Teacher Two", department: "Information Systems" }
];

router.get('/', (req, res) => {
  res.json(teachers);
});

router.post('/', (req, res) => {
  const newTeacher = { id: teachers.length + 1, ...req.body };
  teachers.push(newTeacher);
  res.status(201).json(newTeacher);
});

module.exports = router;
