//BIBLIOTECAS
//HELPER
import helpers from "../../helpers/helpers";
//TYPE
import t from "../../../types";
//MODELS
import model_evento from "../../models/evento/model_evento";

const controller_evento = class controller_evento {
    static async criar(c: t.Context) {
        try {
            const dados_body: t.Controllers.Evento.Criar.Input = await c.req.json();

            const dados_validados = t.Controllers.Evento.Criar.InputSchema.parse(dados_body);

            const new_evento = await model_evento.criar(dados_validados, c);

            const results = {
                data: {
                    evento: new_evento.data.evento,
                },
            };
            return helpers.set_response.c.CREATED({message: "Sucesso ao criar evento!", c: c, results: results});
        } catch (error) {
            return helpers.set_response.c.SERVER_ERROR({error, c});
        }
    }

    static async buscar_pelo_id(c: t.Context) {
        try {
            const id = c.req.param("id");

            const dados_validados = t.Controllers.Evento.BuscarPeloId.InputSchema.parse({data: {_id: id}});

            const new_evento = await model_evento.buscar_pelo_id({data: {_id: dados_validados.data._id}}, c);

            if (!new_evento?.data?.evento?._id) {
                return helpers.set_response.c.NOT_FOUND({message: "Evento não encontrado", c: c});
            }

            const results = {
                data: {
                    evento: new_evento.data.evento,
                },
            };
            return helpers.set_response.c.SUCCESS({message: "Sucesso ao buscar evento!", c: c, results: results});
        } catch (error) {
            return helpers.set_response.c.SERVER_ERROR({error, c});
        }
    }

    static async buscar_pelo_filtro(c: t.Context) {
        try {
            const url = new URL(c.req.url);
            const filtros: t.Controllers.Evento.BuscarPeloFiltro.Input = {
                filtros: {
                    evento: {
                        pagina: parseInt(url.searchParams.get("pagina") || "1"),
                        _id: url.searchParams.get("_id") || undefined,
                        evento: url.searchParams.get("evento") || undefined,
                        data: url.searchParams.get("data") || undefined,
                        hora: url.searchParams.get("hora") || undefined,
                        local: url.searchParams.get("local") || undefined,
                        responsavel: url.searchParams.get("responsavel") || undefined,
                        aberto_ao_publico: url.searchParams.get("aberto_ao_publico") === "true" ? true : url.searchParams.get("aberto_ao_publico") === "false" ? false : undefined,
                        usuario_create_id: url.searchParams.get("usuario_create_id") || undefined,
                    },
                },
            };

            const dados_validados = t.Controllers.Evento.BuscarPeloFiltro.InputSchema.parse(filtros);

            const get_eventos = await model_evento.buscar_pelo_filtro(dados_validados, c);

            const results = {
                data: {
                    paginacao: get_eventos.data.paginacao,
                    evento: get_eventos.data.evento,
                },
            };
            return helpers.set_response.c.SUCCESS({message: "Sucesso ao buscar eventos!", c: c, results: results});
        } catch (error) {
            return helpers.set_response.c.SERVER_ERROR({error, c});
        }
    }

    static async atualizar_pelo_id(c: t.Context) {
        try {
            const id = c.req.param("id");
            const dados_body: t.Controllers.Evento.AtualizarPeloId.Input = await c.req.json();

            const dados_validados = t.Controllers.Evento.AtualizarPeloId.InputSchema.parse({
                ...dados_body,
                data: {evento: {...dados_body.data.evento, _id: id}},
            });

            const new_evento = await model_evento.atualizar_pelo_id(dados_validados, c);

            const results = {
                data: {
                    evento: new_evento.data.evento,
                },
            };
            return helpers.set_response.c.SUCCESS({message: "Sucesso ao atualizar evento!", c: c, results: results});
        } catch (error) {
            return helpers.set_response.c.SERVER_ERROR({error, c});
        }
    }

    static async deletar_pelo_id(c: t.Context) {
        try {
            const id = c.req.param("id");

            const dados_body: t.Controllers.Evento.DeletarPeloId.Input = {data: {_id: id}};

            const dados_validados = t.Controllers.Evento.DeletarPeloId.InputSchema.parse(dados_body);

            await model_evento.deletar_pelo_id(dados_validados.data._id, c);

            const results = {
                data: {
                    evento: {},
                },
            };
            return helpers.set_response.c.SUCCESS({message: "Sucesso ao deletar evento!", c: c, results: results});
        } catch (error) {
            return helpers.set_response.c.SERVER_ERROR({error, c});
        }
    }
};

export default controller_evento;
