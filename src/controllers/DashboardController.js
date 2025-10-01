export const showDashboard = (req, res) => {
  res.render("layouts/dashboard", { error: null });
};

export const showHome = (req, res) => {
  res.render("layouts/main", { error: null });
};

