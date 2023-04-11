import { Router } from "express";
import { sendMenssage,messagesPrivate,delteChatComversations,workingUsers,newsWorks,dataUsuerChat } from "../controllers/menssagesController.js";


export const MessagesRouter=Router()

MessagesRouter.post('/sendMenssage/:id',sendMenssage)
MessagesRouter.get('/messagesPrivate/:id',messagesPrivate)
MessagesRouter.delete('/deleteChat/:id',delteChatComversations)
MessagesRouter.get('/workingUsers/:id',workingUsers)
MessagesRouter.get('/newWorks/:id',newsWorks)
MessagesRouter.get('/dataUsuerChat/:email',dataUsuerChat)
MessagesRouter.post('/delteChatComversations/:id',delteChatComversations)


