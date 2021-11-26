const mongoose = require("mongoose");
const app = require("./app");
const port = process.env.PORT || 3977;
const { API_VERSION, IP_SERVER, PORT_DB } = require("./config");



mongoose.connect(`mongodb+srv://${IP_SERVER}`, {useNewUrlParser: true, useUnifiedTopology:true}, (err, res) => {
    if(err){
        throw err;
    }else{
        app.listen(port, ()=> {
            console.log("***********************************************");
            console.log("------  QUIERO BARBER API EN EJECUCIÓN  -------");
            console.log("");
            //console.log(`http://${IP_SERVER}:${port}/api/${API_VERSION}/`);

        })
    }
})


//    mongodb+srv://marrieta:<password>@quierobarber.86uqs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority