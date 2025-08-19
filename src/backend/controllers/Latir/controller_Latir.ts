typescript
//BIBLIOTECAS
//HELPER
import helpers from "../../helpers/helpers";
//TYPE
import t from "../../../types";
//MODELS
import model_latir from "../../models/latir/model_latir";

const controller_latir = class controller_latir {
    static async criar(c: t.Context) {
        try {
            const dados_body: t.Controllers.Latir.Criar.Input = await c.req.json();

            const dados_validados = t.Controllers.Latir.Criar.InputSchema.parse(dados_body);

            const new_latir = await model_latir.criar(dados_validados, c);

            const results = {
                data: {
                    latir: new_latir.data.latir,
                },
            };
            return helpers.set_response.c.CREATED({ message: "Sucesso ao criar latir!", c: c, results: results });
        } catch (error) {
            return helpers.set_response.c.SERVER_ERROR({ error, c });
        }
    }

    static async buscar_pelo_id(c: t.Context) {
        try {
            const id = c.req.param("id");

            const dados_validados = t.Controllers.Latir.BuscarPeloId.InputSchema.parse({ data: { id: id } });

            const new_latir = await model_latir.buscar_pelo_id({ data: { id: dados_validados.data.id } }, c);

            if (!new_latir?.data?.latir?.id) {
                return helpers.set_response.c.NOT_FOUND({ message: "Latir não encontrado", c: c });
            }

            const results = {
                data: {
                    latir: new_latir.data.latir,
                },
            };
            return helpers.set_response.c.SUCCESS({ message: "Sucesso ao buscar latir!", c: c, results: results });
        } catch (error) {
            return helpers.set_response.c.SERVER_ERROR({ error, c });
        }
    }

    static async buscar_pelo_filtro(c: t.Context) {
        try {
            const url = new URL(c.req.url);
            const filtros: t.Controllers.Latir.BuscarPeloFiltro.Input = {
                filtros: {
                    latir: {
                        pagina: parseInt(url.searchParams.get("pagina") || "1"),
                        id: url.searchParams.get("id") || undefined,
                        descricao: url.searchParams.get("descricao") || undefined,
                        tipo: url.searchParams.get("tipo") || undefined,
                        valor: url.searchParams.get("valor") || undefined,
                        data: url.searchParams.get("data") || undefined,
                        categoria: url.searchParams.get("categoria") || undefined,
                        usuario_id: url.searchParams.get("usuario_id") || undefined,
                        raca: url.searchParams.get("raca") || undefined,
                        idade: url.searchParams.get("idade") || undefined,
                    },
                },
            };

            const dados_validados = t.Controllers.Latir.BuscarPeloFiltro.InputSchema.parse(filtros);

            const get_latir = await model_latir.buscar_pelo_filtro(dados_validados, c);

            const results = {
                data: {
                    paginacao: get_latir.data.paginacao,
                    latir: get_latir.data.latir,
                },
            };
            return helpers.set_response.c.SUCCESS({ message: "Sucesso ao buscar latir!", c: c, results: results });
        } catch (error) {
            return helpers.set_response.c.SERVER_ERROR({ error, c });
        }
    }

    static async atualizar_pelo_id(c: t.Context) {
        try {
            const id = c.req.param("id");
            const dados_body: t.Controllers.Latir.AtualizarPeloId.Input = await c.req.json();

            const dados_validados = t.Controllers.Latir.AtualizarPeloId.InputSchema.parse({
                ...dados_body,
                data: { latir: { ...dados_body.data.latir, id: id } },
            });

            const new_latir = await model_latir.atualizar_pelo_id(dados_validados, c);

            const results = {
                data: {
                    latir: new_latir.data.latir,
                },
            };
            return helpers.set_response.c.SUCCESS({ message: "Sucesso ao atualizar latir!", c: c, results: results });
        } catch (error) {
            return helpers.set_response.c.SERVER_ERROR({ error, c });
        }
    }

    static async deletar_pelo_id(c: t.Context) {
        try {
            const id = c.req.param("id");

            const dados_body: t.Controllers.Latir.DeletarPeloId.Input = { id: id };

            const dados_validados = t.Controllers.Latir.DeletarPeloId.InputSchema.parse(dados_body);

            await model_latir.deletar_pelo_id(dados_validados.id, c);

            const results = {
                data: {
                    latir: {},
                },
            };
            return helpers.set_response.c.SUCCESS({ message: "Sucesso ao deletar latir!", c: c, results: results });
        } catch (error) {
            return helpers.set_response.c.SERVER_ERROR({ error, c });
        }
    }
};

export default controller_latir;
