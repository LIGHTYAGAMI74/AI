const Module = require("../models/module");
const User = require("../models/user");
const { getModuleProgress } = require("./progress");
const { getAllowedLevels } = require("../utils/levelAccess");

exports.submitModuleTest = async (req, res) => {
  try {
    const { moduleId, score } = req.body;

    const user = await User.findById(req.user.id);

    // ✅ CURRENT MODULE PROGRESS
    const currentModule = getModuleProgress(user, moduleId);

    if (score >= 40) {
      currentModule.moduleTestPassed = true;
      currentModule.completed = true;
    }

    // 🔥 TEST HISTORY (unchanged)
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

    // ===============================
    // 🔥 UNLOCK NEXT MODULE (FIX HERE)
    // ===============================

    if (score >= 40) {
      // 1. Get current module doc
      const currentModuleDoc = await Module.findById(moduleId);

      // 2. Get ALL modules of same level sorted
      const allModules = await Module.find({
        level: currentModuleDoc.level,
      }).sort({ order: 1 });

      // 3. Find index
      const currentIndex = allModules.findIndex(
        (m) => m._id.toString() === moduleId
      );

      const nextModuleDoc = allModules[currentIndex + 1];

      if (nextModuleDoc) {
        // 4. Find or create next module progress
        let nextProgress = user.progress.modules.find(
          (m) =>
            m.moduleId?.toString() === nextModuleDoc._id.toString()
        );

        if (!nextProgress) {
          user.progress.modules.push({
            moduleId: nextModuleDoc._id,
            unlocked: true,
            completed: false,
            moduleTestPassed: false,
            chapters: [],
          });
        } else {
          nextProgress.unlocked = true;
        }
      }
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
