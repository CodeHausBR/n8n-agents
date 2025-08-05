typescript
//BIBLIOTECAS
//HELPER
import helpers from "helpers/helpers";
//TYPE
import t from "onda-types";
//MODELS
import model_contasPagar from "mvc/models/model_contasPagar";

const controller_contasPagar = class controller_contasPagar {
    static async criar(c: t.Banco.Context) {
        try {
            const dados_body: t.Banco.Controllers.ContasPagar.Criar.Input = await c.req.json();

            const dados_validados = t.Banco.Controllers.ContasPagar.Criar.InputSchema.parse(dados_body)

            const new_contaPagar = await model_contasPagar.criar(dados_validados, c);

            const results = {
                data: {
                    contasPagar: new_contaPagar.data.contasPagar
                }
            }
            return helpers.set_response.c.CREATED({ message: "Sucesso ao criar conta a pagar!", c: c, results: results });
        } catch (erro) {
            return helpers.set_response.c.SERVER_ERROR(erro, c);
        }
    }

    static async buscar_pelo_id(c: t.Banco.Context) {
        try {
            const id = c.req.param("id");

            const dados_validados = t.Banco.Controllers.ContasPagar.BuscarPeloId.InputSchema.parse({ data: { id: Number(id) } })

            const new_contaPagar = await model_contasPagar.buscar_pelo_id({ data: { id: dados_validados.data.id } }, c);

            const results = {
                data: {
                    contasPagar: new_contaPagar.data.contasPagar
                }
            }
            return helpers.set_response.c.SUCCESS({ message: "Sucesso ao buscar conta a pagar!", c: c, results: results });
        } catch (erro) {
            return helpers.set_response.c.SERVER_ERROR(erro, c);
        }
    }

    static async buscar_pelo_filtro(c: t.Banco.Context) {
        try {
            const url = new URL(c.req.url);
            const filtros: t.Banco.Controllers.ContasPagar.BuscarPeloFiltro.Input = {
                filtros: {
                    id: url.searchParams.get("id") ? Number(url.searchParams.get("id")) : undefined,
                    descricao: url.searchParams.get("descricao"),
                    tipo: url.searchParams.get("tipo") as any,
                    valor: url.searchParams.get("valor") ? parseFloat(url.searchParams.get("valor")) : undefined,
                    data: url.searchParams.get("data"),
                    categoria: url.searchParams.get("categoria"),
                    usuario_id: url.searchParams.get("usuario_id") ? Number(url.searchParams.get("usuario_id")) : undefined,
                }
            };

            const dados_validados = t.Banco.Controllers.ContasPagar.BuscarPeloFiltro.InputSchema.parse(filtros)

            const get_contasPagar = await model_contasPagar.buscar_pelo_filtro(dados_validados, c);

            const results = {
                data: {
                    paginacao: get_contasPagar.data.paginacao,
                    contasPagar: get_contasPagar.data.contasPagar
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

            const dados_validados = t.Banco.Controllers.ContasPagar.AtualizarPeloId.InputSchema.parse({ ...dados_body, data: { ...dados_body.data, id: Number(id) } })

            const new_contaPagar = await model_contasPagar.atualizar_pelo_id(dados_validados, c);

            const results = {
                data: {
                    contasPagar: new_contaPagar.data.contasPagar
                }
            }
            return helpers.set_response.c.SUCCESS({ message: "Sucesso ao atualizar conta a pagar!", c: c, results: results });
        } catch (erro) {
            return helpers.set_response.c.SERVER_ERROR(erro, c);
        }
    }

    static async deletar_pelo_id(c: t.Banco.Context) {
        try {
            const id = c.req.param("id");

            const dados_validados = t.Banco.Controllers.ContasPagar.DeletarPeloId.InputSchema.parse({ id: Number(id) })

            await model_contasPagar.deletar_pelo_id(dados_validados.id, c);

            const results = {
                data: {
                    contasPagar: {}
                }
            }
            return helpers.set_response.c.SUCCESS({ message: "Sucesso ao deletar conta a pagar!", c: c, results: results });
        } catch (erro) {
            return helpers.set_response.c.SERVER_ERROR(erro, c);
        }
    }
};

export default controller_contasPagar;
