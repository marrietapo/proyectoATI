const Comment = require("../models/comment");
const BarberShop = require("../models/barbershop");


function addComment(req, res) {
  const { rate, comm, userId, barbershopId } = req.body;

  const comment = new Comment();
  comment.rate = rate;
  comment.comment = comm;
  comment.user = userId;
  comment.barbershop = barbershopId;

  comment.save((error, result) => {
    if (error) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!result) {
        res.status(404).send({ message: "Error al crear el comentario." });
      } else {
        let createdComment = result;
        BarberShop.findById(barbershopId, (error, result) => {
          if (error) {
            res.status(500).send({ message: "Error del servidor." });
          } else {
            if (!result) {
              res
                .status(404)
                .send({ message: "No se ha encontrado la Barbería." });
            } else {
              let barberShop = new BarberShop();
              barberShop = result;

              barberShop.comments = [
                ...barberShop.comments,
                createdComment._id,
              ];
              BarberShop.findByIdAndUpdate(
                barbershopId,
                barberShop,
                (error, result) => {
                  if (error) {
                    res.status(500).send({ message: "Error del servidor." });
                  } else {
                    if (!result) {
                      res
                        .status(404)
                        .send({ message: "No se ha encontrado la Barbería." });
                    } else {
                      res.status(200).send({
                        message: "Comentario agregado correctamente.",
                      });
                    }
                  }
                }
              );
            }
          }
        });
      }
    }
  });
}

function getComments(req, res) {
  Comment.find().then((result) => {
    if (!result) {
      res.status(404).send({ message: "No se han encontrado comentarios." });
    } else {
      res.status(200).send({
        message: "Comentarios encontrados correctamente.",
        comments: result,
      });
    }
  });
}


function getCommentsByBarbershop(req, res) {
  let barbershop = req.params.barbershop;

  Comment.find({ barbershop })
    .sort({ created: 1 })
    .then((result) => {
      if (!result) {
        res.status(404).send({ message: "No se han encontrado comentarios." });
      } else {
        res.status(200).send({
          message: "Comentarios encontrados correctamente.",
          comments: result,
        });
      }
    });
}

function deleteComment(req, res) {
  const { id } = req.params;

  Comment.findByIdAndRemove(id, (error, result) => {
    if (error) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!result) {
        res.status(404).send({ message: "Comentario no encontrado." });
      } else {
        res
          .status(200)
          .send({ message: "Comentario eliminado correctamente." });
      }
    }
  });
}

module.exports = {
  addComment,
  getComments,
  deleteComment,
  getCommentsByBarbershop,
};
