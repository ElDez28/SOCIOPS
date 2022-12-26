const app = require("./app");
const mongoose = require("mongoose");

mongoose.connect(
  process.env.DATABASE,
  {
    useNewUrlParser: true,
  },
  () => {
    console.log("Connected to the database");
  }
);

app.listen(process.env.PORT, () => {
  console.log("Server running on port 5000");
});
