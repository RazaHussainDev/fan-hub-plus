// Admin Controller - Dummy wiring
exports.getDashboardStats = (req, res) => {
  res.status(200).json({ success: true, data: { status: "wired" }, message: "Dashboard stats wired" });
};
