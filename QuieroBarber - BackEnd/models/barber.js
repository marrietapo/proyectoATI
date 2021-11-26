const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BarberSchema = Schema({
  name: String,
  lastName: String,
  description: String,
  aka: String,
  active: Boolean,
  barbershop: {
    type: Schema.Types.ObjectId,
    ref: "BarberShop",
    autopopulate: { maxDepth: 1 },
  },
  avatar: String,
  until: Date,
  from: Date, 
  break:[String]
});

BarberSchema.plugin(require("mongoose-autopopulate"));


module.exports = mongoose.model("Barber", BarberSchema);
