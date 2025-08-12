//BIBLIOTECAS
//HELPER
import helpers from "../../helpers/helpers";
//TYPE
import t from "../../../types";
//MODELS
import ModelHelpers from "../../models/helpers/modelHelpers";

const controllerHelpers = class controllerHelpers {
    static async criar(c: t.Context) {
        try {
            const dados: t.Controllers.Helpers.Criar.Input = await c.req.json();

            const dados_validados = t.Controllers.Helpers.Criar.InputSchema.parse(dados);

            const new_helper = await ModelHelpers.criar(dados_validados, c);

            const results = {
                data: {
                    helper: new_helper.data.helper,
                },
            };
            return helpers.set_response.c.CREATED({message: "Sucesso ao criar helper!", c: c, results: results});
        } catch (erro) {
            return helpers.set_response.c.SERVER_ERROR({error: erro, c: c});
        }
    }

    static async buscar_pelo_id(c: t.Context) {
        try {
            const id = c.req.param("id");

            const dados_validados = t.Controllers.Helpers.BuscarPeloId.InputSchema.parse({data: {_id: id}});

            const helper = await ModelHelpers.buscar_pelo_id({data: {_id: dados_validados.data._id}}, c);

            const results = {
                data: {
                    helper: helper.data.helper,
                },
            };
            return helpers.set_response.c.SUCCESS({message: "Sucesso ao buscar helper!", c: c, results: results});
        } catch (erro) {
            return helpers.set_response.c.SERVER_ERROR({error: erro, c: c});
        }
    }

    static async buscar_pelo_filtro(c: t.Context) {
        try {
            const url = new URL(c.req.url);
            const filtros: t.Controllers.Helpers.BuscarPeloFiltro.Input = {
                filtros: {
                    helper: {
                        _id: url.searchParams.get("_id"),
                        descricao: url.searchParams.get("descricao"),
                        permissao: url.searchParams.get("permissao") ? parseInt(url.searchParams.get("permissao")!) : null,
                        setor: url.searchParams.get("setor"),
                    },
                },
            };

            const valodar_dados_body = t.Controllers.Helpers.BuscarPeloFiltro.InputSchema.parse(filtros);

            const get_helpers = await ModelHelpers.buscar_pelo_filtro(valodar_dados_body, c);

            const results = {
                data: {
                    helpers: get_helpers.data.helpers,
                },
            };
            return helpers.set_response.c.SUCCESS({message: "Sucesso ao buscar helpers!", c: c, results: results});
        } catch (erro) {
            return helpers.set_response.c.SERVER_ERROR({error: erro, c: c});
        }
    }

    static async atualizar_pelo_id(c: t.Context) {
        try {
            const id = c.req.param("id");
            const data: t.Controllers.Helpers.AtualizarPeloId.Input = await c.req.json();

            const new_helper = await ModelHelpers.atualizar_pelo_id({...data, data: {helper: {...data.data.helper, _id: id}}}, c);

            const results = {
                data: {
                    helper: new_helper.data.helper,
                },
            };
            return helpers.set_response.c.SUCCESS({message: "Sucesso ao atualizar helper!", c: c, results: results});
        } catch (erro) {
            return helpers.set_response.c.SERVER_ERROR({error: erro, c: c});
        }
    }

    static async deletar_pelo_id(c: t.Context) {
        try {
            const id = c.req.param("id");

            await ModelHelpers.deletar_pelo_id(id, c);

            const results = {
                data: {
                    helper: {},
                },
            };
            return helpers.set_response.c.SUCCESS({message: "Sucesso ao deletar helper!", c: c, results: results});
        } catch (erro) {
            return helpers.set_response.c.SERVER_ERROR({error: erro, c: c});
        }
    }
};

export default controllerHelpers;
