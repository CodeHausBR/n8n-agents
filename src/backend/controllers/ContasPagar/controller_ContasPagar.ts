typescript
//BIBLIOTECAS
//HELPER
import helpers from "helpers/helpers";
//TYPE
import t from "onda-types";
//MODELS
import model_contas_pagar from "mvc/models/model_contas_pagar";

const controller_contas_pagar = class controller_contas_pagar {
    static async criar(c: t.Banco.Context) {
        try {
            const dados_body: t.Banco.Controllers.ContasPagar.Criar.Input = await c.req.json();

            const dados_validados = t.Banco.Controllers.ContasPagar.Criar.InputSchema.parse(dados_body)

            const new_contas_pagar = await model_contas_pagar.criar(dados_validados, c);

            const results = {
                data: {
                    contasPagar: new_contas_pagar.data.contasPagar
                }
            }
            return helpers.set_response.c.CREATED({ message: "Sucesso ao criar contas a pagar!", c: c, results: results });
        } catch (erro) {
            return helpers.set_response.c.SERVER_ERROR(erro, c);
        }
    }

    static async buscar_pelo_id(c: t.Banco.Context) {
        try {
            const id = c.req.param("id");

            const dados_validados = t.Banco.Controllers.ContasPagar.BuscarPeloId.InputSchema.parse({ data: { id: Number(id) } })

            const new_contas_pagar = await model_contas_pagar.buscar_pelo_id({ data: { id: dados_validados.data.id } }, c);

            const results = {
                data: {
                    contasPagar: new_contas_pagar.data.contasPagar
                }
            }
            return helpers.set_response.c.SUCCESS({ message: "Sucesso ao buscar contas a pagar!", c: c, results: results });
        } catch (erro) {
            return helpers.set_response.c.SERVER_ERROR(erro, c);
        }
    }

    static async buscar_pelo_filtro(c: t.Banco.Context) {
        try {
            const url = new URL(c.req.url);
            const filtros: t.Banco.Controllers.ContasPagar.BuscarPeloFiltro.Input = {
                filtros: {
                    categoria: url.searchParams.get("categoria"),
                    usuario_id: url.searchParams.get("usuario_id") ? parseInt(url.searchParams.get("usuario_id")) : undefined,
                    data: url.searchParams.get("data"),
                    tipo: url.searchParams.get("tipo")
                }
            };

            const dados_validados = t.Banco.Controllers.ContasPagar.BuscarPeloFiltro.InputSchema.parse(filtros)

            const get_contas_pagar = await model_contas_pagar.buscar_pelo_filtro(dados_validados, c);

            const results = {
                data: {
                    paginacao: get_contas_pagar.data.paginacao,
                    contasPagar: get_contas_pagar.data.contasPagar
                }
            }
            return helpers.set_response.c.SUCCESS({ message: "Sucesso ao buscar contas a pagar!", c: c, results: results });
        } catch (erro) {
            return helpers.set_response.c.SERVER_ERROR(erro, c);
        }
    }

    static async atualizar_pelo_id(c: t.Banco.Context) {
        try {
            const id = c.req.param("id");
            const dados_body: t.Banco.Controllers.ContasPagar.AtualizarPeloId.Input = await c.req.json();

            const dados_validados = t.Banco.Controllers.ContasPagar.AtualizarPeloId.InputSchema.parse({ ...dados_body, data: { contasPagar: { ...dados_body.data.contasPagar, id: Number(id) } } });

            const new_contas_pagar = await model_contas_pagar.atualizar_pelo_id(dados_validados, c);

            const results = {
                data: {
                    contasPagar: new_contas_pagar.data.contasPagar
                }
            }
            return helpers.set_response.c.SUCCESS({ message: "Sucesso ao atualizar contas a pagar!", c: c, results: results });
        } catch (erro) {
            return helpers.set_response.c.SERVER_ERROR(erro, c);
        }
    }

    static async deletar_pelo_id(c: t.Banco.Context) {
        try {
            const id = c.req.param("id");

            const dados_validados = t.Banco.Controllers.ContasPagar.DeletarPeloId.InputSchema.parse({ id: Number(id) })

            await model_contas_pagar.deletar_pelo_id(dados_validados.id, c);

            const results = {
                data: {
                    contasPagar: {}
                }
            }
            return helpers.set_response.c.SUCCESS({ message: "Sucesso ao deletar contas a pagar!", c: c, results: results });
        } catch (erro) {
            return helpers.set_response.c.SERVER_ERROR(erro, c);
        }
    }
};

export default controller_contas_pagar;
