const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    schoolname: {
      type: String,
      required: false,
    },
    major: {
      type: String,
      required: false,
    },
    bio: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", ProfileSchema);