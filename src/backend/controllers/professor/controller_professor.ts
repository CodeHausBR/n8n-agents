//BIBLIOTECAS
//HELPER
import helpers from "../../helpers/helpers";
//TYPE
import t from "../../../types";
//MODELS
import model_professor from "../../models/professor/model_professor";

const controller_professor = class controller_professor {
    static async criar(c: t.Context) {
        try {
            const dados_body: t.Controllers.Professor.Criar.Input = await c.req.json();

            const dados_validados = t.Controllers.Professor.Criar.InputSchema.parse(dados_body);

            const new_professor = await model_professor.criar(dados_validados, c);

            const results = {
                data: {
                    professor: new_professor.data.professor,
                },
            };
            return helpers.set_response.c.CREATED({message: "Sucesso ao criar professor!", c: c, results: results});
        } catch (error) {
            return helpers.set_response.c.SERVER_ERROR({error, c});
        }
    }

    static async buscar_pelo_id(c: t.Context) {
        try {
            const id = c.req.param("id");

            const dados_validados = t.Controllers.Professor.BuscarPeloId.InputSchema.parse({data: {_id: id}});

            const new_professor = await model_professor.buscar_pelo_id({data: {_id: dados_validados.data._id}}, c);

            if (!new_professor?.data?.professor?._id) {
                return helpers.set_response.c.NOT_FOUND({message: "Professor não encontrado", c: c});
            }

            const results = {
                data: {
                    professor: new_professor.data.professor,
                },
            };
            return helpers.set_response.c.SUCCESS({message: "Sucesso ao buscar professor!", c: c, results: results});
        } catch (error) {
            return helpers.set_response.c.SERVER_ERROR({error, c});
        }
    }

    static async buscar_pelo_filtro(c: t.Context) {
        try {
            const url = new URL(c.req.url);
            const filtros: t.Controllers.Professor.BuscarPeloFiltro.Input = {
                filtros: {
                    professor: {
                        pagina: parseInt(url.searchParams.get("pagina") || "1"),
                        _id: url.searchParams.get("_id") || undefined,
                        nome: url.searchParams.get("nome") || undefined,
                        matricula: url.searchParams.get("matricula") || undefined,
                        disciplina: url.searchParams.get("disciplina") || undefined,
                        email: url.searchParams.get("email") || undefined,
                        telefone: url.searchParams.get("telefone") || undefined,
                        sexo: url.searchParams.get("sexo") || undefined,
                        dataNascimento: url.searchParams.get("dataNascimento") || undefined,
                        usuario_create_id: url.searchParams.get("usuario_create_id") || undefined,
                    },
                },
            };

            const dados_validados = t.Controllers.Professor.BuscarPeloFiltro.InputSchema.parse(filtros);

            const get_professor = await model_professor.buscar_pelo_filtro(dados_validados, c);

            const results = {
                data: {
                    paginacao: get_professor.data.paginacao,
                    professor: get_professor.data.professor,
                },
            };
            return helpers.set_response.c.SUCCESS({message: "Sucesso ao buscar professores!", c: c, results: results});
        } catch (error) {
            return helpers.set_response.c.SERVER_ERROR({error, c});
        }
    }

    static async atualizar_pelo_id(c: t.Context) {
        try {
            const id = c.req.param("id");
            const dados_body: t.Controllers.Professor.AtualizarPeloId.Input = await c.req.json();

            const dados_validados = t.Controllers.Professor.AtualizarPeloId.InputSchema.parse({
                ...dados_body,
                data: {professor: {...dados_body.data.professor, _id: id}},
            });

            const new_professor = await model_professor.atualizar_pelo_id(dados_validados, c);

            const results = {
                data: {
                    professor: new_professor.data.professor,
                },
            };
            return helpers.set_response.c.SUCCESS({message: "Sucesso ao atualizar professor!", c: c, results: results});
        } catch (error) {
            return helpers.set_response.c.SERVER_ERROR({error, c});
        }
    }

    static async deletar_pelo_id(c: t.Context) {
        try {
            const id = c.req.param("id");

            const dados_body: t.Controllers.Professor.DeletarPeloId.Input = {data: {_id: id}};

            const dados_validados = t.Controllers.Professor.DeletarPeloId.InputSchema.parse(dados_body);

            await model_professor.deletar_pelo_id(dados_validados.data._id, c);

            const results = {
                data: {
                    professor: {},
                },
            };
            return helpers.set_response.c.SUCCESS({message: "Sucesso ao deletar professor!", c: c, results: results});
        } catch (error) {
            return helpers.set_response.c.SERVER_ERROR({error, c});
        }
    }
};

export default controller_professor;
