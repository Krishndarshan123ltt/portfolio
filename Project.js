const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  link: String,
  year: String,
  category: String,
  status: String,
  stack: [String],
  highlights: [String],
});

module.exports = mongoose.model("Project", projectSchema);
