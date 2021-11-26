const express = require("express");

const app = express();

const {API_VERSION } = require("./config");

const authRoutes = require("./routers/auth");
const userRoutes = require("./routers/user");
const commentRoutes = require("./routers/comment");
const barberRoutes = require("./routers/barber");
const barberShopRoutes = require("./routers/barbershop");
const serviceRoutes = require("./routers/service");
const reservationRoutes = require("./routers/reservation");
const notificationRoutes = require("./routers/notifications");


app.use(express.urlencoded({extended : false}));
app.use(express.json());
app.use(express.json({limit: '25mb'}));
app.use(express.urlencoded({limit: '25mb'}));   
app.use((req, res, next) =>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, DELETE"
    );
    res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

app.use(`/api/${API_VERSION}`, authRoutes);
app.use(`/api/${API_VERSION}`, userRoutes);
app.use(`/api/${API_VERSION}`, commentRoutes);
app.use(`/api/${API_VERSION}`, barberRoutes);
app.use(`/api/${API_VERSION}`, barberShopRoutes);
app.use(`/api/${API_VERSION}`, serviceRoutes);
app.use(`/api/${API_VERSION}`, reservationRoutes);
app.use(`/api/${API_VERSION}`, notificationRoutes);




module.exports = app;