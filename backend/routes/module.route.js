// const express = require('express');
// const router = express.Router();
// const Module = require('../model/module');
// const auth = require('../middleware/auth.middleware');

// // ADMIN: Save a new Notion link
// router.post('/add', auth, async (req, res) => {
//   if (req.user.role !== 'admin') return res.status(403).json({ msg: "Admin only" });

//   try {
//     const { title, description, notionUrl } = req.body;
//     const newModule = new Module({ title, description, notionUrl });
//     await newModule.save();
//     res.json({ msg: "Module link saved!", module: newModule });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // STUDENT: Get all available modules
// router.get('/all', async (req, res) => {
//   try {
//     const modules = await Module.find().sort({ createdAt: -1 });
//     res.json(modules);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const Module = require('../model/module');
const User = require('../model/user'); // 1. Import User model to check student level
const auth = require('../middleware/auth');

// ADMIN: Save a new Notion link (Tagged by Level)
router.post('/add', auth, async (req, res) => {
  // Check if the user is an admin
  if (req.user.role !== 'admin') return res.status(403).json({ msg: "Admin only" });

  try {
    // 2. Extract 'level' from the request body
    const { title, description, notionUrl, level } = req.body;

    if (!level) return res.status(400).json({ msg: "Level is required" });

    const newModule = new Module({ 
      title, 
      description, 
      notionUrl, 
      level // '6-8', '9-12', or 'College'
    });

    await newModule.save();
    res.json({ msg: `Module link saved for ${level}!`, module: newModule });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// STUDENT: Get only modules matching their class level
// 3. Added 'auth' middleware here to identify the student
router.get('/all', auth, async (req, res) => {
  try {
    // 4. Find the student in the database using the ID from the token
    const user = await User.findById(req.user.id);
    
    if (!user) return res.status(404).json({ msg: "User not found" });

    // 5. Filter modules by the student's level
    const modules = await Module.find({ level: user.level }).sort({ createdAt: -1 });
    
    res.json(modules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;