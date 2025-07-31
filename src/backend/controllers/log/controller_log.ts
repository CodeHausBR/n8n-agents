//HONO
import {Context} from "hono";

//HELPERS
import t from "../../../types";

import helpers from "../../helpers/helpers";

//MODELS
import model_log from "../../models/log/model_log";

const controller_log = class controller_log {
    static async criar(c: t.Context) {
        try {
            const data = c.req.query();

            const validar_dados = t.Controllers.Log.Criar.InputSchema.parse(data);

            const resultado = await model_log.criar(validar_dados, c);

            const results = {
                data: {
                    log: resultado.data.log,
                },
            };
            return helpers.set_response.c.CREATED({message: "Sucesso ao criar cliente!", c: c, results: results});
        } catch (error) {
            return helpers.set_response.c.SERVER_ERROR({error: error, c: c});
        }
    }
    static async buscar_pelo_filtro(c: t.Context) {
        try {
            const url = new URL(c.req.url);

            const filtros: t.Controllers.Log.BuscarPeloFiltro.Input = {
                filtros: {
                    log: {
                        type: url.searchParams.get("type") as t.Controllers.Log.LogType,
                        matrix: url.searchParams.get("matrix"),
                    },
                },
            };

            const validar_dados = t.Controllers.Log.BuscarPeloFiltro.InputSchema.parse(filtros);

            const resultado = await model_log.buscar_pelo_filtro(validar_dados, c);

            const results = {
                data: {
                    log: resultado.data.log,
                },
            };
            return helpers.set_response.c.SUCCESS({message: "Sucesso ao criar cliente!", c: c, results: results});
        } catch (error) {
            return helpers.set_response.c.SERVER_ERROR({error: error, c: c});
        }
    }
};

export default controller_log;
