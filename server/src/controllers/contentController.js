// Content Controller - Dummy wiring
exports.getContent = (req, res) => {
  res.status(200).json({ success: true, data: { status: "wired" }, message: "Content wired" });
};
