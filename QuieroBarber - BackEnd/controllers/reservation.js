const Reservation = require("../models/reservation");
const Barber = require("../models/barber");
var moment = require("moment");



function addReservation(req, res) {
  const { date, service, barber, barbershop, slot, totalAmount } = req.body;

  const reservation = new Reservation();
  reservation.date = date;
  reservation.service = service;
  reservation.barber = barber;
  reservation.barbershop = barbershop;
  reservation.user = req.user._id;
  reservation.active = true;
  reservation.slot = slot;
  reservation.totalAmount = totalAmount;

  if(moment(reservation.date).toDate()< moment().toDate()){
    res
      .status(404)
      .send({
        message: "El día seleccionado debe ser posterior a la fecha actual.",
      });
  }else{
    Barber.findById({ _id: barber })
    .then((result) => {
      if (!result) {
        res.status(404).send({ message: "No es posible efectuar la reserva el día seleccionado." });
      } else {

        let fromEdited = moment(date)
          .hours(moment(result.from).hours())
          .minutes(moment(result.from).minutes());

        let untilEdited = moment(date)
          .hours(moment(result.until).hours())
          .minutes(moment(result.until).minutes());

        if (
          fromEdited > moment(date).toDate() ||
          untilEdited < moment(date).toDate()
        ) {
          res
            .status(404)
            .send({ message: "Horario fuera de rango del barbero." });
        } else {
          console.log(result);
          reservation.save((error, result) => {
            if (error) {
              res.status(500).send({ message: "Error del servidor." });
            } else {
              if (!result) {
                res.status(404).send({ message: "Error al crear el reserva." });
              } else {
                res.status(200).send({
                  message: "Reserva agregada correctamente.",
                  reservation: result,
                });
              }
            }
          });
        }
      }
    });
  }
}

function getReservations(req, res) {
  Reservation.find().sort({date: -1}).then((result) => {
    if (!result) {
      res.status(404).send({ message: "No se han encontrado reservas." });
    } else {
      res.status(200).send({
        message: "Reservas encontradas correctamente.",
        reservations: result,
      });
    }
  });
}



function getReservation(req, res) {
  Reservation.findById( req.params.id ).then((result) => {
    if (!result) {
      res.status(404).send({ message: "No se han encontrado reserva." });
    } else {
      res.status(200).send({
        message: "Reserva encontrados correctamente.",
        reservation: result,
      });
    }
  });
}


function getReservationsByBarbershop(req, res) {
  let barbershop = req.params.barbershop;
  Reservation.find({ barbershop })
    .sort({ date: 1 })
    .then((result) => {
      if (!result) {
        res.status(404).send({ message: "No se han encontrado reservas." });
      } else {
        res.status(200).send({
          message: "Reservas encontrados correctamente.",
          reservations: result,
        });
      }
    });
}

function getReservationsByBarber(req, res) {
  let barber = req.params.barber;
  Reservation.find({ barber }).then((result) => {
    if (!result) {
      res.status(404).send({ message: "No se han encontrado reservas." });
    } else {
      res.status(200).send({
        message: "Reservas encontrados correctamente.",
        reservations: result,
      });
    }
  });
}

function getReservationsByUser(req, res) {
  let user = req.params.user;
  Reservation.find({ user })
    .sort({ date: -1 })
    .then((result) => {
      if (!result) {
        res.status(404).send({ message: "No se han encontrado reservas." });
      } else {
        res.status(200).send({
          message: "Reservas encontrados correctamente.",
          reservations: result,
        });
      }
    });
}


function getNextReservation(req, res) {
  let user = req.params.user;
  console.log(req.params.user);
  Reservation.find({ user })
    .sort({ date: 1 })
    .then((result) => {
      if (!result) {
        res.status(404).send({ message: "No se han encontrado reservas." });
      } else {
        var resp = null;
        if(result!==[]){
          var filter = result.filter(x=>moment(x.date).toDate()> moment().toDate());
          if(filter!==null){
            resp = filter[0];
          }
        }
        res.status(200).send({
          message: "Reservas encontrados correctamente.",
          reservation: resp,
        });
      }
    });
}


async function updateReservation(req, res) {
  let data = req.body;
  const params = req.params;
  Reservation.findByIdAndUpdate({ _id: params.id }, data, (error, result) => {
    if (error) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!result) {
        res.status(404).send({ message: "Reserva no encontrada." });
      } else {
        res.status(200).send({ message: "Reserva actualizada correctamente." });
      }
    }
  });
}

function activateReservation(req, res) {
  const { id } = req.params;
  const { active } = req.body;

  Reservation.findByIdAndUpdate(id, { active }, (error, result) => {
    if (error) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!result) {
        res.status(404).send({ message: "Reserva no encontrada." });
      } else {
        if (active === true) {
          res.status(200).send({ message: "Reserva activada correctamente." });
        } else {
          res
            .status(200)
            .send({ message: "Reserva desactivada correctamente." });
        }
      }
    }
  });
}

function getReservationsActive(req, res) {
  const { active } = req.body;
  const params = req.params;
  Reservation.find({ active: active, barbershop: params.barbershop }).then(
    (reservations) => {
      if (!reservations) {
        res.status(404).send({ message: "No se han encontrado reservas." });
      } else {
        res.status(200).send({
          message: "Reservas encontradas correctamente.",
          reservations: reservations,
        });
      }
    }
  );
}

function deleteReservation(req, res) {
  const { id } = req.params;
  Reservation.findByIdAndRemove(id, (error, result) => {
    if (error) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!result) {
        res.status(404).send({ message: "Reserva no encontrada." });
      } else {
        res.status(200).send({ message: "Reserva eliminada correctamente." });
      }
    }
  });
}

function getReservationsByBarberAndDate(req, res) {
  const barber = req.query.barber;
  Reservation.find({
    barber,
    date: {
      $gte: moment(req.query.date).startOf("day").toDate(),
      $lte: moment(req.query.date).endOf("day").toDate(),
    },
  }).then((result) => {
    if (!result) {
      res
        .status(404)
        .send({ message: "No se han encontrado reservas." });
    } else {
      res.status(200).send({
        message: "Reservas encontradas correctamente.",
        reservations: result,
      });
    }
  });
}



module.exports = {
  addReservation,
  getReservations,
  updateReservation,
  activateReservation,
  getReservationsByBarbershop,
  getReservationsByBarber,
  getReservationsByUser,
  getReservation,
  getNextReservation,
  deleteReservation,
  getReservationsActive,
  getReservationsByBarberAndDate,
};
