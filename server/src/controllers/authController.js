// Auth Controller - Dummy wiring
exports.login = (req, res) => {
  res.status(200).json({ success: true, data: { status: "wired" }, message: "Login wired" });
};

exports.register = (req, res) => {
  res.status(200).json({ success: true, data: { status: "wired" }, message: "Register wired" });
};
