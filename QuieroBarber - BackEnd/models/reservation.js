const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var moment = require("moment");

const ReservationSchema = Schema({
  date: Date,
  created: Date,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    autopopulate: { maxDepth: 1 },
  },
  barbershop: {
    type: Schema.Types.ObjectId,
    ref: "BarberShop",
    autopopulate: { maxDepth: 1 },
  },
  barber: {
    type: Schema.Types.ObjectId,
    ref: "Barber",
    autopopulate: { maxDepth: 1 },
  },
  service: [
    {
      type: Schema.Types.ObjectId,
      ref: "Service",
      autopopulate: { maxDepth: 1 },
      
    },
  ],
  totalAmount:Number,
  active: Boolean,
  slot: Number
});


ReservationSchema.pre("save", function (next) {

  //this.created = moment().add(moment().utcOffset(), "minutes");
  //this.date = moment(this.date).add(moment().utcOffset(), "minutes");
  next();
});

ReservationSchema.plugin(require("mongoose-autopopulate"));

module.exports = mongoose.model("Reservation", ReservationSchema);
