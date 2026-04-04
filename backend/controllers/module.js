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
