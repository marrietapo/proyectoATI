const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var moment = require("moment");


const CommentSchema = Schema({
  comment: String,
  rate: {
    type: Number,
    max: [10, "Puntuación máxima 10"],
    min: [1, "Puntuación mínima 1"],
  },
  created: Date,
  user: { type: Schema.Types.ObjectId, ref: "User", autopopulate: true },
  barbershop: { type: Schema.Types.ObjectId, ref: "BarberShop" },
});


CommentSchema.pre("save", function (next) {
  this.created = moment().add(moment().utcOffset(), "minutes");
  next();
});


CommentSchema.plugin(require("mongoose-autopopulate"));

module.exports = mongoose.model("Comment", CommentSchema);
