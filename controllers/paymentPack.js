import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config/config.js";
import conexion from "../database/db.js";
import Stripe from 'stripe'

const stripe=new Stripe('sk_test_51MsvOdAbbMzh5r4qlzSwQ78W5wFGuS11mipmHGogqjnUVGm2WM8GaYQojootumYgXTyidcyFojM0PacJAzrLobr800aNMkwlpr')

export const payment = async(req,res) =>{
    try {
        
    const {id,amount,paquete}=req.body
        const pay=  await stripe.paymentIntents.create({
            amount:amount,
            currency:"COP",
            description:paquete,
            payment_method:id,
            confirm:true
        })
        res.json("confirm")
        } catch (error) {
            console.log(error);
            res.json(error.raw.message)
        }
}

export const updatePack = async (req,res) =>{
    try {
        const token=req.headers["token"]
        let {pack} = req.body

        if (token) {
            let correo=jwt.verify(token,TOKEN_SECRET)
            let {email}=correo 
            if(pack == 1){
                const [result] = await conexion.query('UPDATE cliente SET cod_paquete = "1" , info_paquete = 5 WHERE email = ?',[email])
                if (result.affectedRows != 0) {
                    res.json({data:"update pack"})
                }
            }
            if(pack == 2){
                const [result] = await conexion.query('UPDATE cliente SET cod_paquete = "2" , info_paquete = 10 WHERE email = ?',[email])
                if (result.affectedRows != 0) {
                    res.json({data:"update pack"})
                }
            }
            if(pack == 3){
                const [result] = await conexion.query('UPDATE cliente SET cod_paquete = "3" , info_paquete = 15 WHERE email = ?',[email])
                if (result.affectedRows != 0) {
                    res.json({data:"update pack"})
                }
            }
            
        }
    } catch (error) {
        res.json(error)
        console.log(error);
    }
    

    
}