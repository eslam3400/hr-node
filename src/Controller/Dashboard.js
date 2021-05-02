let dashboard = (req, res) => {
  res.render('dashboard', { tab: "Dashboard" })
}

module.exports = { dashboard }