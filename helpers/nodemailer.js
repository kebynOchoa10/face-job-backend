import nodemailer from "nodemailer"

export const nodemailerPass = async (email, cod) => {
    const config = {
        host: "smtp.gmail.com",
        port: 587,
        auth: {
          user: "emailfacejob@gmail.com",
          pass: "srdtzluhsurmiocq",
        },
      };
    
      const mensaje = {
        from: "emailfacejob@gmail.com",
        to: email,
        subject: "Recuperar Conraseña de usuario FACE_JOB",
        html: `Su codigo es : ${cod}`,
      };
    
      const transporter = nodemailer.createTransport(config);
    
      const info = await transporter.sendMail(mensaje);

      return cod
}
