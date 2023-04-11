import conexion from "../database/db.js"
import jwt from "jsonwebtoken";
import { TOKEN_CODE, TOKEN_EXPIRE, TOKEN_SECRET } from "../config/config.js";
import { uploadImageChat } from "../utils/cloudinary.js";

export const sendMenssage=async(req,res)=>{
   
    try {
        
       let {message,tipo}=req.body
        const token = req.headers['token'];
        const {id}=req.params
        
        if (token) {
            let correo=jwt.verify(token,TOKEN_SECRET)
            let {email}=correo 
            let img;
            if (tipo=='img') {
                 if (req.files.img) {
        const result = await uploadImageChat(req.files.img.tempFilePath);
        console.log(result);
        img = result.secure_url;
       
            }
           message='Imagen'
            }else{
                img='NULL'
            }
       
            
            const [result]=await conexion.query('INSERT INTO mensaje(remitente,receptor,mensaje,tipo,link) VALUES (?,?,?,?,?)',[email,id,message,tipo,img])
        if (result.affectedRows!=0) {
            res.json('insert ok')
        }else{
            res.json('error')
        }
        }
       
    
    } catch (error) {
        console.log(error);
    }

}


export const messagesPrivate=async(req,res)=>{
    try {
        const token = req.headers['token'];
        const {id}=req.params
        if (token) {
            let correo=jwt.verify(token,TOKEN_SECRET)
            let {email}=correo 
            const [result]=await conexion.query("SELECT *,DATE_FORMAT(fecha,'%H:%i:%s') AS hora from mensaje WHERE remitente=? and receptor=? or remitente=? and receptor=? ",[email,id,id,email])
                if (result.length>0) {
                  
                    for (let i = 0; i < result.length; i++) {
                        let horas=result[i].hora.split(":",2)
                        let horasFinal=`${horas[0]}:${horas[1]}`
                        result[i].hora=horasFinal
                    }
                   
                     res.json(result)
                }else{
                    res.json('not results')
                }
           
               
    
         
        }
        
        
       
    } catch (error) {
        console.log(error);
    }
}


export const delteChatComversations=async (req,res)=>{
try {
    const {report}=req.body
    const {id}=req.params
    const token = req.headers['token'];
    if (token) {
        let correo=jwt.verify(token,TOKEN_SECRET)
        let {email}=correo
        const [result]=await conexion.query('DELETE FROM mensaje WHERE remitente=? AND receptor=? OR remitente=? and receptor=?',[email,id,id,email])
        if (result.affectedRows!=0) {
           if (report==0) {
            let nuevoEstado='Eliminado'
            const [resulti]=await conexion.query('UPDATE trabajos SET estado=? WHERE mi_email=? AND profecional_email=? OR mi_email=? AND profecional_email=?',[nuevoEstado,email,id,id,email])
            if (resulti.affectedRows!=0) {
                res.json('delete chat')
            }else{
                res.json('not delete')
            }
        }else{
            let nuevoEstado='Reportado'
            const [resulti]=await conexion.query('UPDATE trabajos SET estado=? WHERE mi_email=? AND profecional_email=? OR mi_email=? AND profecional_email=?',[nuevoEstado,email,id,id,email])
            if (resulti.affectedRows!=0) {
                res.json('delete and Report chat')
            }else{
                res.json('not delete and report')
            }
        }
        }else{
            res.json('error ')
        }
    }
   
    
} catch (error) {
    console.log(error);
}
}






export const newsWorks=async(req,res)=>{
    try {
       
        const token = req.headers['token'];
        const {id}=req.params

        if (token) {
            let correo=jwt.verify(token,TOKEN_SECRET)
            let {email}=correo

             const [result]=await conexion.query('SELECT trabajos.profecional_email FROM trabajos WHERE   mi_email=? AND estado=?',[email,id])
            
            
                let profecionals=[]
                for (let i = 0; i < result.length; i++) {
                    const parametro=result[i].profecional_email
                
                    const [resulti]=await conexion.query('SELECT trabajos.estado,cliente.name,cliente.lastname,cliente.namecomplete,cliente.profession,cliente.iconUser,cliente.email FROM trabajos,cliente WHERE trabajos.profecional_email=cliente.email AND profecional_email=?',[parametro])
                
                    if (resulti.length>0) {
                        profecionals.push(resulti[0])
                        const [resultado]= await conexion.query("SELECT DATE_FORMAT(fecha,'%H:%i:%s') AS hora,mensaje FROM mensaje WHERE remitente=? AND receptor=? or receptor=? AND remitente=? ORDER BY fecha DESC LIMIT 1",[email,parametro,email,parametro])
                        if (resultado.length>0) {
                            profecionals[i].mensaje=resultado[0].mensaje 
                            profecionals[i].hora=resultado[0].hora
                           let horas=profecionals[i].hora.split(":",2)
                          
                           let horasFinal=`${horas[0]}:${horas[1]}`
                           profecionals[i].hora=horasFinal
                        }else{
                            profecionals[i].mensaje="Face-job" 
                            profecionals[i].hora="00:00"
                    
                        }
                        
                        
                    }
                }
           
                res.json(profecionals)
        
        }
       
    } catch (error) {
        console.log(error);        
    }
}



export const dataUsuerChat=async(req,res)=>{
try {
    const {email}=req.params
    const [result]=await conexion.query('SELECT * FROM cliente WHERE email=?',[email])
    if (result.length>0) {
        res.json(result)
    }
} catch (error) {
    console.log(error);
}
}


export const workingUsers=async (req,res)=>{
    try {
        const token = req.headers['token'];
        const {id}=req.params
        
        if (token) {
            let correo=jwt.verify(token,TOKEN_SECRET)
            let {email}=correo
          
            const [resulti]=await conexion.query('UPDATE trabajos SET estado="trabajando"  WHERE mi_email=? AND profecional_email=?',[email,id])
        if (resulti.affectedRows!=0) {
            res.json('you are woirking')
        }else{
            res.json('you are not working')
        }
        }
        
        
    } catch (error) {
        console.log(error);
    }
}


