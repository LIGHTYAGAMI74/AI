// const MockTest = require('../model/MockTest');
// const Result = require('../model/Result');
// const User = require('../model/user'); // Ensure this path is correct

// // 1. Create a New Test (Admin)
// exports.createTest = async (req, res) => {
//   try {
//     const { title, duration, questions } = req.body;
//     const test = new MockTest({ 
//       title, 
//       duration: duration || 20, 
//       questions 
//     });
//     await test.save();
//     res.status(201).json({ msg: "Mock Test Created!", test });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // 2. Submit Test & Evaluate (Student) - UPDATED TO SAVE STATS
// exports.submitTest = async (req, res) => {
//   try {
//     const { testId, answers } = req.body; 
//     const test = await MockTest.findById(testId);
//     const user = await User.findById(req.user.id);

//     if (!test || !user) return res.status(404).json({ msg: "Test or User not found" });

//     let correctCount = 0;
//     test.questions.forEach((q, index) => {
//       if (answers[index] === q.correctAnswer) {
//         correctCount++;
//       }
//     });

//     const score = Math.round((correctCount / test.questions.length) * 100);
//     const today = new Date().toISOString().split('T')[0];

//     // Create record in Result Collection
//     const result = new Result({
//       student: req.user.id,
//       test: testId,
//       score,
//       totalQuestions: test.questions.length,
//       correctAnswers: correctCount,
//       dateString: today
//     });
//     await result.save();

//     // UPDATE USER ANALYTICS STATS
//     if (!user.stats.activityLog.includes(today)) {
//       user.stats.activityLog.push(today);
//       user.stats.activityDays += 1;
//     }

//     user.stats.testHistory.push({
//       testId: test._id,
//       testName: test.title,
//       score: score,
//       date: new Date()
//     });

//     user.stats.lastActiveDate = new Date();
//     await user.save();

//     res.json({ msg: "Test Evaluated and Stats Updated", score, correctCount });
//   } catch (err) {
//     console.error("Submit Error:", err);
//     res.status(500).json({ error: err.message });
//   }
// };

// // 3. Get All Tests
// exports.getTests = async (req, res) => {
//   try {
//     const tests = await MockTest.find();
//     res.json(tests);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

const MockTest = require('../model/MockTest');
const Result = require('../model/Result');
const User = require('../model/user');

// 1. Create a New Test (Admin) - Includes 'level'
exports.createTest = async (req, res) => {
  try {
    const { title, duration, questions, level } = req.body;
    const test = new MockTest({ 
      title, 
      duration: duration || 20, 
      questions,
      level // '6-8', '9-12', or 'College'
    });
    await test.save();
    res.status(201).json({ msg: `Mock Test Created for ${level}!`, test });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Submit Test & Evaluate (Student)
exports.submitTest = async (req, res) => {
  try {
    const { testId, answers } = req.body;
    const test = await MockTest.findById(testId);
    const user = await User.findById(req.user.id);

    let correctCount = 0;
    test.questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) correctCount++;
    });

    const score = Math.round((correctCount / test.questions.length) * 100);
    const today = new Date().toISOString().split('T')[0];

    // --- LOGIC TO HANDLE REPEATED TESTS ---
    // Check if user has taken THIS test before
    const existingTestIndex = user.stats.testHistory.findIndex(
      (item) => item.testId.toString() === testId
    );

    if (existingTestIndex > -1) {
      // If found, update with the latest score and date
      user.stats.testHistory[existingTestIndex].score = score;
      user.stats.testHistory[existingTestIndex].date = new Date();
    } else {
      // If new, push it to history
      user.stats.testHistory.push({
        testId: test._id,
        testName: test.title,
        score: score,
        date: new Date()
      });
    }

    // Update activity log
    if (!user.stats.activityLog.includes(today)) {
      user.stats.activityLog.push(today);
      user.stats.activityDays += 1;
    }

    await user.save();
    res.json({ msg: "Test Evaluated", score, correctCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// 3. Get Filtered Tests (Student)
exports.getTests = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    // Only fetch tests that match the user's registered level
    const tests = await MockTest.find({ level: user.level });
    res.json(tests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};