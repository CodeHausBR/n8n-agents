import * as jose from "jose";

import helpers from "../helpers";
import type {Context, Next} from "hono";
import t from "../../../types";

const token = class token {
    static async verifyToken(c: Context, next: Next) {
        try {
            const authHeader = c.req.header("Authorization");
            if (!authHeader) {
                return helpers.set_response.INVALID_TOKEN({message: "token não enviado!!!", c: c});
            }

            const token: string = authHeader.split(" ")[1];
            if (!token) {
                return helpers.set_response.INVALID_TOKEN({message: "Acesso negado!!!", c: c});
            }

            const secret = new TextEncoder().encode(c.env.JSON_WEB_TOKEN_AUTH_USER);
            const {payload}: {payload: t.Controllers.UserPayload.AuthPayload} = await jose.jwtVerify(token, secret);

            if (payload.type_user == "ONDA_USER") {
                const setar_token: t.Token.UserToken = {
                    _id: payload.onda_user_id,
                    app: "wave",
                    tipo: payload.type_user,
                };
                c.set("usuario_auth", setar_token as t.Controllers.UserPayload.UserToken);
            } else if (payload.type_user == "imobiliaria") {
                const setar_token: t.Token.UserToken = {
                    _id: payload.onda_imob_id,
                    app: "wave",
                    tipo: payload.type_user,
                };
                c.set("usuario_auth", setar_token as t.Controllers.UserPayload.UserToken);
            } else {
                return helpers.set_response.INVALID_TOKEN({message: "Acesso negado, sem tipo cadastrado!!!", c: c});
            }

            return await next();
        } catch (error) {
            return helpers.set_response.INVALID_TOKEN({message: "Token inválido!!!", c: c});
        }
    }
};
export default token;
