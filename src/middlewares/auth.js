const adminAuth = (req, res, next) => {
    console.log("Admin auth is getting checked");
    const token = "xyz";
    const isAuthorized = token === "xyz";
    if (!isAuthorized) {
      res.status(403).json({ message: "You are not authorized" });
    } else {
      next()
    }
}

module.exports = {
    adminAuth}