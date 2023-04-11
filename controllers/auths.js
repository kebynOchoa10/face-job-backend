import conexion from "../database/db.js";
import bcrypt from "bcrypt";
import { TOKEN_SECRET, TOKEN_EXPIRE } from "../config/config.js";
import jwt from "jsonwebtoken";

export const createUserClient = async (req, res) => {
  try {
    let { email, name,lastname, date, number, password, iconUser, profession, codigo} =
      req.body;
    codigo = 0;
    iconUser = ""
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    const [result] = await conexion.query(
      "SELECT * FROM cliente WHERE email = ?",
      [email]
    );
    if (result.length > 0) {
      res.json({ data: "ya existe el correo" });
    } else {
      const [result] = await conexion.query(
        `INSERT INTO cliente (email, name, age, number, password, iconUser, profession, codigo,lastname,namecomplete) VALUES(?, ?, ?, ?, ?, ?, ?, ?,?,${name+" "+lastname})`,
        [email, name, date, number, hash, iconUser, profession, codigo,lastname]
      );
      if (result.affectedRow != 0) {
        return res.json({ data: "INSERT_OK" });
      } else {
        return res.json({ data: "ERROR", error });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "ERROR 404", error });
  }
};

export const loginUserClient = async (req, res) => {
  try {
    let { email } = req.body;
    let { password } = req.body;
    const [result] = await conexion.query(
      "SELECT * FROM cliente WHERE email = ?",
      [email]
    );
    if (result.length > 0) {
      result.map((element) => {
        bcrypt.compare(password, element.password, async (error, isMatch) => {
          if (!isMatch) {
            return res.json({ data: "PASSWORD_ERROR" });
          } else {
            const email = result[0].email;
            const token = jwt.sign({ email }, TOKEN_SECRET, {
              expiresIn: TOKEN_EXPIRE,
            });
            return res.json({ data: "logueado", result, token });
          }
        });
      });
    } else {
      console.log(result);
      return res.json({ data: "El usuario no existe" });
    }
  } catch (error) {}
};
