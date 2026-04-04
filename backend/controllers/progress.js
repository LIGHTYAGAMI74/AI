const User = require("../models/user");
const Module = require("../models/module");

//////////////////////////////////////////////////////////
// 🔥 HELPER: GET OR CREATE MODULE PROGRESS
//////////////////////////////////////////////////////////
const getModuleProgress = (user, moduleId) => {
  let module = user.progress.modules.find(
    (m) => m.moduleId?.toString() === moduleId?.toString()
  );

  if (!module) {
    module = {
      moduleId,
      unlocked: false,
      completed: false,
      moduleTestPassed: false,
      chapters: [],
    };

    user.progress.modules.push(module);
  }

  return module;
};

//////////////////////////////////////////////////////////
// 🔥 HELPER: GET OR CREATE CHAPTER
//////////////////////////////////////////////////////////
const getChapterProgress = (module, chapterId) => {
  let chapter = module.chapters.find(
    (c) => c.chapterId === chapterId
  );

  if (!chapter) {
    chapter = {
      chapterId,
      topics: [],
      topicsCompleted: 0,
      chapterTestPassed: false,
      lastAttemptedAt: null,
    };

    module.chapters.push(chapter);
  }

  return chapter;
};

//////////////////////////////////////////////////////////
// 🔥 HELPER: GET OR CREATE TOPIC
//////////////////////////////////////////////////////////
const getTopicProgress = (chapter, topicId) => {
  let topic = chapter.topics.find(
    (t) => t.topicId === topicId
  );

  if (!topic) {
    topic = {
      topicId,
      completed: false,
    };

    chapter.topics.push(topic);
  }

  return topic;
};

//////////////////////////////////////////////////////////
// 🔥 1. MARK TOPIC COMPLETE
//////////////////////////////////////////////////////////
exports.markTopicComplete = async (req, res) => {
  try {
    const { moduleId, chapterId, topicId } = req.body;

    const user = await User.findById(req.user.id);

    const module = getModuleProgress(user, moduleId);
    const chapter = getChapterProgress(module, chapterId);
    const topic = getTopicProgress(chapter, topicId);

    if (!topic.completed) {
      topic.completed = true;
      chapter.topicsCompleted = (chapter.topicsCompleted || 0) + 1;
    }

    await user.save();

    res.json({
      message: "Topic marked complete",
      chapter,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//////////////////////////////////////////////////////////
// 🔥 2. CHAPTER PRACTICE ATTEMPT
//////////////////////////////////////////////////////////
exports.markChapterPractice = async (req, res) => {
  try {
    const { moduleId, chapterId, totalChapters } = req.body;

    const user = await User.findById(req.user.id);

    const module = getModuleProgress(user, moduleId);
    const chapter = getChapterProgress(module, chapterId);

    chapter.chapterTestPassed = true;
    chapter.lastAttemptedAt = new Date();

    const passedChapters = module.chapters.filter(
      (c) => c.chapterTestPassed === true
    );

    if (totalChapters && passedChapters.length === totalChapters) {
      module.completed = true;
    }

    await user.save();

    res.json({
      message: "Chapter practice marked",
      chapter,
      module,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//////////////////////////////////////////////////////////
// 🔥 3. GET USER PROGRESS (SELF-HEALING)
//////////////////////////////////////////////////////////
exports.getMyProgress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("progress");

    const allModules = await Module.find();

    allModules.forEach((mod) => {
      let existing = user.progress.modules.find(
        (m) => m.moduleId?.toString() === mod._id.toString()
      );

      if (!existing) {
        user.progress.modules.push({
          moduleId: mod._id,
          unlocked: false, // 🔥 DO NOT AUTO-UNLOCK
          completed: false,
          moduleTestPassed: false,
          chapters: [],
        });
      }
    });

    // 🔥 Ensure FIRST MODULE OF EACH LEVEL is unlocked
    const modulesByLevel = await Module.find().sort({ level: 1, order: 1 });

    const firstModulePerLevel = {};

    modulesByLevel.forEach((mod) => {
      if (!firstModulePerLevel[mod.level]) {
        firstModulePerLevel[mod.level] = mod._id.toString();
      }
    });

    Object.values(firstModulePerLevel).forEach((moduleId) => {
      const mod = user.progress.modules.find(
        (m) => m.moduleId?.toString() === moduleId
      );

      if (mod) mod.unlocked = true;
    });

    await user.save();

    res.json(user.progress);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//////////////////////////////////////////////////////////
// 🔥 4. SUBMIT MODULE TEST
//////////////////////////////////////////////////////////
exports.submitModuleTest = async (req, res) => {
  try {
    const { moduleId, score, moduleTitle } = req.body;

    const user = await User.findById(req.user.id);

    const module = getModuleProgress(user, moduleId);

    // ✅ PASS CONDITION
    if (score >= 40) {
      module.moduleTestPassed = true;
      module.completed = true;

      // 🔥 CRITICAL FIX
      module.unlocked = true;
    }

    //////////////////////////////////////////////////////
    // 🔥 TEST HISTORY
    //////////////////////////////////////////////////////
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
        moduleTitle,
        bestScore: score,
        lastScore: score,
        attempts: 1,
        lastAttemptedAt: new Date(),
      });
    }

    // ===============================
    // 🔥 UNLOCK NEXT MODULE (LEVEL-WISE)
    // ===============================
    if (score >= 40) {
      const currentModuleDoc = await Module.findById(moduleId);

      const allModules = await Module.find({
        level: currentModuleDoc.level,
      }).sort({ order: 1 });

      const currentIndex = allModules.findIndex(
        (m) => m._id.toString() === moduleId.toString()
      );

      const nextModule = allModules[currentIndex + 1];

      if (nextModule) {
        let nextProgress = user.progress.modules.find(
          (m) =>
            m.moduleId?.toString() === nextModule._id.toString()
        );

        if (!nextProgress) {
          user.progress.modules.push({
            moduleId: nextModule._id,
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
      message: "Module test submitted",
      score,
      passed: score >= 40,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};