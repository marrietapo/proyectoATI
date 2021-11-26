const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate");
var moment = require("moment");


const BarberShopSchema = Schema({
  name: {
    required: [true, "requerido"],
    type: String,
  },
  description: String,
  phone: String,
  address: {
    required: [true, "requerido"],
    type: String,
  },
  geo: {
    lat: {
      type: Number,
      required: [true, "requerido"],
    },
    lng: {
      type: Number,
      required: [true, "requerido"],
    },
  },
  images: [String],
  logo: String,
  social: {
    instagram: String,
    facebook: String,
    web: String,
    twitter: String,
    youtube: String,
    whatsapp: String
  },
  barbers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Barber",
      autopopulate: { maxDepth: 1 },
    },
  ],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      autopopulate: { maxDepth: 2 },
    },
  ],
  created: Date,
  active: Boolean,
  coffee: Boolean,
  child: Boolean,
  services: [
    {
      type: Schema.Types.ObjectId,
      ref: "Service",
      autopopulate: { maxDepth: 1 },
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    autopopulate: { maxDepth: 1 },
  },
  schedule: {
    open: Date,
    close: Date,
  },
});

BarberShopSchema.plugin(mongoosePaginate);
BarberShopSchema.plugin(require("mongoose-autopopulate"));

BarberShopSchema.pre("save", function (next) {
  this.created = moment().add(moment().utcOffset(), "minutes");
  next();
});

module.exports = mongoose.model("BarberShop", BarberShopSchema);
