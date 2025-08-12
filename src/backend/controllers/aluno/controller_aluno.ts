//BIBLIOTECAS
//HELPER
import helpers from "../../helpers/helpers";
//TYPE
import t from "../../../types";
//MODELS
import model_aluno from "../../models/aluno/model_aluno";

const controller_aluno = class controller_aluno {
    static async criar(c: t.Context) {
        try {
            const dados_body: t.Controllers.Aluno.Criar.Input = await c.req.json();

            const dados_validados = t.Controllers.Aluno.Criar.InputSchema.parse(dados_body);

            const new_aluno = await model_aluno.criar(dados_validados, c);

            const results = {
                data: {
                    aluno: new_aluno.data.aluno,
                },
            };
            return helpers.set_response.c.CREATED({ message: "Sucesso ao criar aluno!", c: c, results: results });
        } catch (error) {
            return helpers.set_response.c.SERVER_ERROR({ error, c });
        }
    }

    static async buscar_pelo_id(c: t.Context) {
        try {
            const id = c.req.param("id");

            const dados_validados = t.Controllers.Aluno.BuscarPeloId.InputSchema.parse({ data: { _id: id } });

            const new_aluno = await model_aluno.buscar_pelo_id({ data: { _id: dados_validados.data._id } }, c);

            if (!new_aluno?.data?.aluno?._id) {
                return helpers.set_response.c.NOT_FOUND({ message: "Aluno não encontrado", c: c });
            }

            const results = {
                data: {
                    aluno: new_aluno.data.aluno,
                },
            };
            return helpers.set_response.c.SUCCESS({ message: "Sucesso ao buscar aluno!", c: c, results: results });
        } catch (error) {
            return helpers.set_response.c.SERVER_ERROR({ error, c });
        }
    }

    static async buscar_pelo_filtro(c: t.Context) {
        try {
            const url = new URL(c.req.url);
            const filtros: t.Controllers.Aluno.BuscarPeloFiltro.Input = {
                filtros: {
                    aluno: {
                        pagina: parseInt(url.searchParams.get("pagina") || "1"),
                        _id: url.searchParams.get("_id") || undefined,
                        nome: url.searchParams.get("nome") || undefined,
                        matricula: url.searchParams.get("matricula") || undefined,
                        serie: url.searchParams.get("serie") || undefined,
                        turma: url.searchParams.get("turma") || undefined,
                        dataNascimento: url.searchParams.get("dataNascimento") || undefined,
                        sexo: url.searchParams.get("sexo") || undefined,
                        usuario_create_id: url.searchParams.get("usuario_create_id") || undefined,
                    },
                },
            };

            const dados_validados = t.Controllers.Aluno.BuscarPeloFiltro.InputSchema.parse(filtros);

            const get_alunos = await model_aluno.buscar_pelo_filtro(dados_validados, c);

            const results = {
                data: {
                    paginacao: get_alunos.data.paginacao,
                    aluno: get_alunos.data.aluno,
                },
            };
            return helpers.set_response.c.SUCCESS({ message: "Sucesso ao buscar alunos!", c: c, results: results });
        } catch (error) {
            return helpers.set_response.c.SERVER_ERROR({ error, c });
        }
    }

    static async atualizar_pelo_id(c: t.Context) {
        try {
            const id = c.req.param("id");
            const dados_body: t.Controllers.Aluno.AtualizarPeloId.Input = await c.req.json();

            const dados_validados = t.Controllers.Aluno.AtualizarPeloId.InputSchema.parse({
                ...dados_body,
                data: { aluno: { ...dados_body.data.aluno, _id: id } },
            });

            const new_aluno = await model_aluno.atualizar_pelo_id(dados_validados, c);

            const results = {
                data: {
                    aluno: new_aluno.data.aluno,
                },
            };
            return helpers.set_response.c.SUCCESS({ message: "Sucesso ao atualizar aluno!", c: c, results: results });
        } catch (error) {
            return helpers.set_response.c.SERVER_ERROR({ error, c });
        }
    }

    static async deletar_pelo_id(c: t.Context) {
        try {
            const id = c.req.param("id");

            const dados_body: t.Controllers.Aluno.DeletarPeloId.Input = { data : {_id: id } } ;

            const dados_validados = t.Controllers.Aluno.DeletarPeloId.InputSchema.parse(dados_body);

            await model_aluno.deletar_pelo_id(dados_validados?.data?._id, c);

            const results = {
                data: {
                    aluno: {},
                },
            };
            return helpers.set_response.c.SUCCESS({ message: "Sucesso ao deletar aluno!", c: c, results: results });
        } catch (error) {
            return helpers.set_response.c.SERVER_ERROR({ error, c });
        }
    }
};

export default controller_aluno;
