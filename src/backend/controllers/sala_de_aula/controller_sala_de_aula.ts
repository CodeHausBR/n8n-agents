//BIBLIOTECAS
//HELPER
import helpers from "../../helpers/helpers";
//TYPE
import t from "../../../types";
//MODELS
import model_sala_de_aula from "../../models/sala_de_aula/model_sala_de_aula";

const controller_sala_de_aula = class controller_sala_de_aula {
    static async criar(c: t.Context) {
        try {
            const dados_body: t.Controllers.SalaDeAula.Criar.Input = await c.req.json();

            const dados_validados = t.Controllers.SalaDeAula.Criar.InputSchema.parse(dados_body);

            const new_sala_de_aula = await model_sala_de_aula.criar(dados_validados, c);

            const results = {
                data: {
                    sala_de_aula: new_sala_de_aula.data.sala_de_aula,
                },
            };
            return helpers.set_response.c.CREATED({message: "Sucesso ao criar sala de aula!", c: c, results: results});
        } catch (error) {
            return helpers.set_response.c.SERVER_ERROR({error, c});
        }
    }

    static async buscar_pelo_id(c: t.Context) {
        try {
            const id = c.req.param("id");

            const dados_validados = t.Controllers.SalaDeAula.BuscarPeloId.InputSchema.parse({data: {_id: id}});

            const new_sala_de_aula = await model_sala_de_aula.buscar_pelo_id({data: {_id: dados_validados.data._id}}, c);

            if (!new_sala_de_aula?.data?.sala_de_aula?._id) {
                return helpers.set_response.c.NOT_FOUND({message: "Sala de aula não encontrada", c: c});
            }

            const results = {
                data: {
                    sala_de_aula: new_sala_de_aula.data.sala_de_aula,
                },
            };
            return helpers.set_response.c.SUCCESS({message: "Sucesso ao buscar sala de aula!", c: c, results: results});
        } catch (error) {
            return helpers.set_response.c.SERVER_ERROR({error, c});
        }
    }

    static async buscar_pelo_filtro(c: t.Context) {
        try {
            const url = new URL(c.req.url);
            const filtros: t.Controllers.SalaDeAula.BuscarPeloFiltro.Input = {
                filtros: {
                    sala_de_aula: {
                        pagina: parseInt(url.searchParams.get("pagina") || "1"),
                        _id: url.searchParams.get("_id") || undefined,
                        sala: url.searchParams.get("sala") || undefined,
                        quantidade_de_lugares: url.searchParams.get("quantidade_de_lugares") ? parseInt(url.searchParams.get("quantidade_de_lugares")!) : undefined,
                        andar: url.searchParams.get("andar") ? parseInt(url.searchParams.get("andar")!) : undefined,
                        tipo: url.searchParams.get("tipo") || undefined,
                        disponivel: url.searchParams.get("disponivel") === "true" ? true : url.searchParams.get("disponivel") === "false" ? false : undefined,
                        usuario_create_id: url.searchParams.get("usuario_create_id") || undefined,
                    },
                },
            };

            const dados_validados = t.Controllers.SalaDeAula.BuscarPeloFiltro.InputSchema.parse(filtros);

            const get_salas_de_aula = await model_sala_de_aula.buscar_pelo_filtro(dados_validados, c);

            const results = {
                data: {
                    paginacao: get_salas_de_aula.data.paginacao,
                    sala_de_aula: get_salas_de_aula.data.sala_de_aula,
                },
            };
            return helpers.set_response.c.SUCCESS({message: "Sucesso ao buscar salas de aula!", c: c, results: results});
        } catch (error) {
            return helpers.set_response.c.SERVER_ERROR({error, c});
        }
    }

    static async atualizar_pelo_id(c: t.Context) {
        try {
            const id = c.req.param("id");
            const dados_body: t.Controllers.SalaDeAula.AtualizarPeloId.Input = await c.req.json();

            const dados_validados = t.Controllers.SalaDeAula.AtualizarPeloId.InputSchema.parse({
                ...dados_body,
                data: {sala_de_aula: {...dados_body.data.sala_de_aula, _id: id}},
            });

            const new_sala_de_aula = await model_sala_de_aula.atualizar_pelo_id(dados_validados, c);

            const results = {
                data: {
                    sala_de_aula: new_sala_de_aula.data.sala_de_aula,
                },
            };
            return helpers.set_response.c.SUCCESS({message: "Sucesso ao atualizar sala de aula!", c: c, results: results});
        } catch (error) {
            return helpers.set_response.c.SERVER_ERROR({error, c});
        }
    }

    static async deletar_pelo_id(c: t.Context) {
        try {
            const id = c.req.param("id");

            const dados_body: t.Controllers.SalaDeAula.DeletarPeloId.Input = {data: {_id: id}};

            const dados_validados = t.Controllers.SalaDeAula.DeletarPeloId.InputSchema.parse(dados_body);

            await model_sala_de_aula.deletar_pelo_id(dados_validados.data._id, c);

            const results = {
                data: {
                    sala_de_aula: {},
                },
            };
            return helpers.set_response.c.SUCCESS({message: "Sucesso ao deletar sala de aula!", c: c, results: results});
        } catch (error) {
            return helpers.set_response.c.SERVER_ERROR({error, c});
        }
    }
};

export default controller_sala_de_aula;
