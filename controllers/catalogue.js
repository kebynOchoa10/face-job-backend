import { TOKEN_SECRET } from "../config/config.js";
import conexion from "../database/db.js";
import jwt from "jsonwebtoken";
export const consultProfessional = async (req, res) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.json({ data: "error" });
  }

  try {
    const encoder = new TextEncoder();
    const jwtData = await jwtVerify(
      authorization,
      encoder.encode(TOKEN_SECRET)
    );

    if (jwtData.payload) {
      const [result] = await conexion.query(
        "SELECT email, iconUser, name, profession FROM cliente"
      );
      res.json({ data: result });
    }
  } catch (error) {
    res.send(error);
  }
};

export const consultTarget = async (req, res) => {
  const [result] = await conexion.query(
    "SELECT email, iconUser, name, profession FROM cliente LIMIT 3;"
  );
  res.json(result);
};

export const consultCategories = async (req, res) => {

  try {
    const token=req.headers['token']


  if (token) {
    let correo=jwt.verify(token,TOKEN_SECRET)
    let {email}=correo
    let {profession} = req.params;
  
  const [result] = await conexion.query(
    `SELECT name,email,profession,iconUser FROM cliente WHERE email!=? and profession=?`,
    [email,profession]
  );

  return res.json(result);
  }
  } catch (error) {
    console.log(error);
  }
  
};

export const consultProfile = async (req, res) => {
  let {email} = req.params;
  const [result] = await conexion.query(
    "SELECT email,name,lastname,number,profession,iconUser FROM cliente WHERE email = ?",
    [email]
  );
  return res.json(result);
};
