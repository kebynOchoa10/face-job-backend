import express, { json } from "express";
import sessions from "express-session";
import cors from "cors"
import bodyParser from"body-parser"
import {PORT_APP} from './config/config.js'
import fileUpload from 'express-fileupload'

//Import Routers
import {UserRouter} from "./router/User.routing.js";
import { PostsUserRouter } from "./router/PostsUser.routing.js";
import { CatalogueRouter } from "./router/Catalogue.routing.js";
import { profileUser } from "./router/profileUser.routing.js";
import { PaymentRouter } from "./router/paymentPack.routing.js";
import { MessagesRouter } from "./router/Messages.Routes.js";
import http from 'http'
import { Server as SoketServer } from "socket.io";

const timeExp = 1000 * 60 * 60 * 24;
const app = express();
const server=http.createServer(app)
const io=new SoketServer(server,{
  cors:{
    origin:'*'
  }
})
app.use(cors())
app.use(json())
app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())
app.use(fileUpload({
  useTempFiles:true,
  tempFileDir:'./upload'
}))
//soket io -->
io.on('connection',(soket)=>{
  soket.on('message',function(message){
      soket.broadcast.emit('message',message)
  }

  )
})





// Rutas -->
app.use(UserRouter)
app.use(PostsUserRouter)
app.use(CatalogueRouter)
app.use(profileUser)
app.use(PaymentRouter)
app.use(MessagesRouter)


// Server -->
server.listen(PORT_APP, () => {
  console.log(`Server running FACE-JOB ${PORT_APP}`);
});
