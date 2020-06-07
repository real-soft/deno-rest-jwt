import { Model, DATA_TYPES } from "https://deno.land/x/denodb/mod.ts";
import {
  makeJwt,
  setExpiration,
  Jose,
  Payload,
} from "https://deno.land/x/djwt/create.ts";
import nanoid from "https://deno.land/x/nanoid/mod.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";

import { JwtConfig } from "../../middlewares/jwt.ts";

export interface IUser {
  id?: string;
  firstName: string;
  lastName: string;
  password: string;
}

export class User extends Model {
  static table = "users";
  static timestamps = true;

  static fields = {
    id: {
      primaryKey: true,
      type: DATA_TYPES.STRING,
    },
    firstName: {
      type: DATA_TYPES.STRING,
    },
    lastName: {
      type: DATA_TYPES.STRING,
    },
    password: {
      type: DATA_TYPES.TEXT,
    },
  };

  static defaults = {
    id: nanoid(),
  };

  static generateJwt(id: string) {
    // // Cree el payload con la fecha de expiración (el token tiene una fecha de expiración) y el ID del usuario actual (puede agregar lo que desee)
    const payload: Payload = {
      id,
      exp: setExpiration(new Date().getTime() + JwtConfig.expirationTime),
    };
    const header: Jose = {
      alg: JwtConfig.alg as Jose["alg"],
      typ: JwtConfig.type,
    };
    return makeJwt({ header, payload, key: JwtConfig.secretKey });
  }

  static async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(8);
    return bcrypt.hash(password, salt);
  }
}
