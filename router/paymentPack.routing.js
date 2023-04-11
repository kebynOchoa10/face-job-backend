import { Router } from "express"
import { payment,updatePack } from "../controllers/paymentPack.js";

export const PaymentRouter = Router()

PaymentRouter.post('/checkout',payment)
PaymentRouter.post('/updatePack',updatePack)
