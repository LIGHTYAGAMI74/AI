const Module = require("../models/module");
const User = require("../models/user");

//////////////////////////////////////////////////////////
// 📦 MODULES
//////////////////////////////////////////////////////////

exports.getModules = async (req, res) => {
  try {
    const modules = await Module.find().sort({ order: 1 });
    res.json({ modules });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.createModule = async (req, res) => {
  try {
    const { title, level } = req.body;

    const module = await Module.create({
      title,
      level,
      order: Date.now(),
      chapters: [],
    });

    res.json({ module });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateChapterPracticeUrl = async (req, res) => {
  try {
    const { chapterKey, practiceUrl } = req.body;

    const module = await Module.findById(req.params.id);

    const chapter = module.chapters.find(
      (c) => c.chapterKey === chapterKey
    );

    if (!chapter) {
      return res.status(404).json({ message: "Chapter not found" });
    }

    chapter.practiceUrl = practiceUrl;

    await module.save();

    res.json({ success: true });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateTopicContent = async (req, res) => {
  try {
    const { chapterKey, topicId, contentUrl, videoUrl } = req.body;

    const module = await Module.findById(req.params.id);

    const chapter = module.chapters.find(
      (c) => c.chapterKey === chapterKey
    );

    if (!chapter) {
      return res.status(404).json({ message: "Chapter not found" });
    }

    const topic = chapter.topics.id(topicId);

    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    if (contentUrl !== undefined) topic.contentUrl = contentUrl;
    if (videoUrl !== undefined) topic.videoUrl = videoUrl;

    await module.save();

    res.json({ success: true });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateModuleTestUrl = async (req, res) => {
  try {
    const { moduleTestUrl } = req.body;

    await Module.findByIdAndUpdate(req.params.id, {
      moduleTestUrl,
    });

    res.json({ success: true });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

//////////////////////////////////////////////////////////
// 👤 USERS
//////////////////////////////////////////////////////////

exports.getUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      level,
      paymentStatus,
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (level) query.level = level;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const users = await User.find(query)
      .select("name email level paymentStatus stats.activityDays")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({
      "stats.activityDays": { $gt: 0 },
    });
    const paidUsers = await User.countDocuments({
      paymentStatus: "completed",
    });

    const avg = await User.aggregate([
      {
        $group: {
          _id: null,
          avgActivityDays: { $avg: "$stats.activityDays" },
        },
      },
    ]);

    res.json({
      totalUsers,
      activeUsers,
      paidUsers,
      avgActivityDays: avg[0]?.avgActivityDays || 0,
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password");

    res.json({ user });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { level, paymentStatus } = req.body;

    const updates = {};

    if (level) updates.level = level;
    if (paymentStatus) updates.paymentStatus = paymentStatus;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    ).select("name email level paymentStatus");

    res.json({ user });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};