const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = Schema({
  name: String,
  lastName: String,
  email: {
    type: String,
    lowercase: true,
    unique: true,
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Correo electrónico de formato inválido",
    ],
  },
  password: String,
  role: Number,
  active: Boolean,
  avatar: String,
  notificationToken: String,
  favourites: [
    {
      type: Schema.Types.ObjectId,
      ref: "BarberShop"
    },
  ]
});

module.exports= mongoose.model("User", UserSchema);