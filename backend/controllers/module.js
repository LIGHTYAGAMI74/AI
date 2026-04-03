const Module = require("../models/module");
const { getAllowedLevels } = require("../utils/levelAccess");

exports.getModules = async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== "student") {
      return res.status(403).json({ message: "Access denied" });
    }

    // 🔥 get user's level
    const User = require("../models/user");
    const fullUser = await User.findById(user.id);

    const allowedLevels = getAllowedLevels(fullUser.level);

    const modules = await Module.find({
      level: { $in: allowedLevels },
    }).sort({ order: 1 });

    res.json(modules);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.submitModuleTest = async (req, res) => {
  try {
    const { moduleId, score } = req.body;

    const user = await User.findById(req.user.id);

    const module = getModuleProgress(user, moduleId);

    if (score >= 40) {
      module.moduleTestPassed = true;
    }

    // 🔥 HANDLE TEST HISTORY (BEST SCORE LOGIC)
    const existing = user.stats.testHistory.find(
      (t) => t.moduleId?.toString() === moduleId
    );

    if (existing) {
      existing.attempts += 1;
      existing.lastScore = score;
      existing.lastAttemptedAt = new Date();

      if (score > existing.bestScore) {
        existing.bestScore = score;
      }
    } else {
      user.stats.testHistory.push({
        moduleId,
        moduleTitle: "Module Test",
        bestScore: score,
        lastScore: score,
        attempts: 1,
        lastAttemptedAt: new Date(),
      });
    }

    await user.save();

    res.json({
      message: "Test submitted",
      passed: score >= 40,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};