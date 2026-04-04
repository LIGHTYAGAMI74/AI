const User = require("../models/user");
const Module = require("../models/module");

// 🔥 HELPER: GET OR CREATE MODULE PROGRESS
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

// 🔥 HELPER: GET OR CREATE CHAPTER
const getChapterProgress = (module, chapterId) => {
  let chapter = module.chapters.find(
    (c) => c.chapterId === chapterId
  );

  if (!chapter) {
    chapter = {
      chapterId, // now this is chapterKey (STRING)
      topics: [],
      topicsCompleted: 0,
      chapterTestPassed: false,
      lastAttemptedAt: null,
    };

    module.chapters.push(chapter);
  }

  return chapter;
};

// 🔥 HELPER: GET OR CREATE TOPIC
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

    // ✅ IMPORTANT: ensure chapter exists BEFORE marking
    chapter.chapterTestPassed = true;
    chapter.lastAttemptedAt = new Date();

    // ✅ Ensure module.chapters actually includes ALL attempted chapters
    const passedChapters = module.chapters.filter(
      (c) => c.chapterTestPassed === true
    );

    // ✅ Only mark module complete when all chapters done
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
// 🔥 4. GET USER PROGRESS
//////////////////////////////////////////////////////////

exports.getMyProgress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("progress");

    res.json(user.progress);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//////////////////////////////////////////////////////////
// 🔥 5. GET USER STATS
//////////////////////////////////////////////////////////
exports.submitModuleTest = async (req, res) => {
  try {
    const { moduleId, score, moduleTitle } = req.body;

    const user = await User.findById(req.user.id);

    const module = getModuleProgress(user, moduleId);

    // ✅ mark pass
    if (score >= 40) {
      module.moduleTestPassed = true;
      module.completed = true;
    }

    // 🔥 TEST HISTORY
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
    // 🔥 UNLOCK NEXT MODULE (ADD THIS)
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