const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ServiceSchema = Schema({
  name: String,
  description: String,
  price: Number,
  duration: Number,
  active: Boolean,
  barbershop: {
    type: Schema.Types.ObjectId,
    ref: "BarberShop"
  },
  image: String,
});

ServiceSchema.plugin(require("mongoose-autopopulate"));

module.exports = mongoose.model("Service", ServiceSchema);
