const User = require("../models/user");

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

  console.log("Received chapterId:", chapterId);

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
// 🔥 3. MODULE TEST RESULT
//////////////////////////////////////////////////////////

exports.submitModuleTest = async (req, res) => {
  try {
    const { moduleId, score } = req.body;

    const user = await User.findById(req.user.id);

    const module = getModuleProgress(user, moduleId);

    if (score >= 40) {
      module.moduleTestPassed = true;

      // 🔥 UNLOCK NEXT MODULE
      const currentIndex = user.progress.modules.findIndex(
        (m) => m.moduleId.toString() === moduleId
      );

      const nextModule = user.progress.modules[currentIndex + 1];

      if (nextModule) {
        nextModule.unlocked = true;
      }
    }

    // 🔥 STORE TEST HISTORY
    user.stats.testHistory.push({
      testName: "Module Test",
      score,
      date: new Date(),
    });

    await user.save();

    res.json({
      message: "Test submitted",
      passed: score >= 40,
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