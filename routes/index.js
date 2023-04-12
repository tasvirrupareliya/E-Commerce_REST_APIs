const app = require("express")();

app.get("/", (req, res) => res.send("Welcome to Xxxxx APIs!"));

app.use("/user", require("./user.routes"));
// app.use("/product", require("./product.routes"));
// app.use("/comment", require("./comment.routes"));
// app.use("/cart", require("./cart.routes"));
// app.use("/order", require("./order.routes"));

module.exports = app;
