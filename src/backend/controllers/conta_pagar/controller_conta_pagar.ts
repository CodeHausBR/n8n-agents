//BIBLIOTECAS
//HELPER
import helpers from "../../helpers/helpers";
//TYPE
import t from "../../../types";
//MODELS
import model_conta_pagar from "../../models/conta_pagar/model_conta_pagar";

const controller_conta_pagar = class controller_conta_pagar {
    static async criar(c: t.Context) {
        try {
            const dados_body: t.Controllers.ContaPagar.Criar.Input = await c.req.json();

            const dados_validados = t.Controllers.ContaPagar.Criar.InputSchema.parse(dados_body);

            const new_conta_pagar = await model_conta_pagar.criar(dados_validados, c);

            const results = {
                data: {
                    conta_pagar: new_conta_pagar.data.conta_pagar,
                },
            };
            return helpers.set_response.c.CREATED({message: "Sucesso ao criar conta a pagar!", c: c, results: results});
        } catch (error) {
            return helpers.set_response.c.SERVER_ERROR({error, c});
        }
    }

    static async buscar_pelo_id(c: t.Context) {
        try {
            const id = c.req.param("id");

            const dados_validados = t.Controllers.ContaPagar.BuscarPeloId.InputSchema.parse({data: {_id: id}});

            const new_conta_pagar = await model_conta_pagar.buscar_pelo_id({data: {_id: dados_validados.data._id}}, c);

            if (!new_conta_pagar?.data?.conta_pagar?._id) {
                return helpers.set_response.c.NOT_FOUND({message: "Conta a pagar não encontrada", c: c});
            }

            const results = {
                data: {
                    conta_pagar: new_conta_pagar.data.conta_pagar,
                },
            };
            return helpers.set_response.c.SUCCESS({message: "Sucesso ao buscar conta a pagar!", c: c, results: results});
        } catch (error) {
            return helpers.set_response.c.SERVER_ERROR({error, c});
        }
    }

    static async buscar_pelo_filtro(c: t.Context) {
        try {
            const url = new URL(c.req.url);
            const filtros: t.Controllers.ContaPagar.BuscarPeloFiltro.Input = {
                filtros: {
                    conta_pagar: {
                        pagina: parseInt(url.searchParams.get("pagina") || "1"),
                        _id: url.searchParams.get("_id") || undefined,
                        checkout: url.searchParams.get("checkout") || undefined,
                        cliente_id: url.searchParams.get("cliente_id") || undefined,
                        parcelas: url.searchParams.get("parcelas") ? parseInt(url.searchParams.get("parcelas")!) : undefined,
                        valor: url.searchParams.get("valor") ? parseFloat(url.searchParams.get("valor")!) : undefined,
                        vencimento: url.searchParams.get("vencimento") || undefined,
                        codigo: url.searchParams.get("codigo") || undefined,
                        metodo_pagamento: url.searchParams.get("metodo_pagamento") || undefined,
                        tipo_pagamento: url.searchParams.get("tipo_pagamento") ? parseInt(url.searchParams.get("tipo_pagamento")!) : undefined,
                        descricao: url.searchParams.get("descricao") || undefined,
                        referencia_externa_primaria: url.searchParams.get("referencia_externa_primaria") || undefined,
                        referencia_externa_secundaria: url.searchParams.get("referencia_externa_secundaria") || undefined,
                        referencia_externa_terciaria: url.searchParams.get("referencia_externa_terciaria") || undefined,
                        referencia_externa_quartenaria: url.searchParams.get("referencia_externa_quartenaria") || undefined,
                        documento_titular: url.searchParams.get("documento_titular") || undefined,
                        titular: url.searchParams.get("titular") || undefined,
                        status: url.searchParams.get("status") ? parseInt(url.searchParams.get("status")!) : undefined,
                        status_descricao: url.searchParams.get("status_descricao") || undefined,
                        pagamento_id: url.searchParams.get("pagamento_id") || undefined,
                        parcela: url.searchParams.get("parcela") ? parseInt(url.searchParams.get("parcela")!) : undefined,
                        valor_pacela: url.searchParams.get("valor_pacela") ? parseFloat(url.searchParams.get("valor_pacela")!) : undefined,
                        usuario_create_id: url.searchParams.get("usuario_create_id") || undefined,
                    },
                },
            };

            const dados_validados = t.Controllers.ContaPagar.BuscarPeloFiltro.InputSchema.parse(filtros);

            const get_contas_pagar = await model_conta_pagar.buscar_pelo_filtro(dados_validados, c);

            const results = {
                data: {
                    paginacao: get_contas_pagar.data.paginacao,
                    conta_pagar: get_contas_pagar.data.conta_pagar,
                },
            };
            return helpers.set_response.c.SUCCESS({message: "Sucesso ao buscar contas a pagar!", c: c, results: results});
        } catch (error) {
            return helpers.set_response.c.SERVER_ERROR({error, c});
        }
    }

    static async atualizar_pelo_id(c: t.Context) {
        try {
            const id = c.req.param("id");
            const dados_body: t.Controllers.ContaPagar.AtualizarPeloId.Input = await c.req.json();

            const dados_validados = t.Controllers.ContaPagar.AtualizarPeloId.InputSchema.parse({
                ...dados_body,
                data: {conta_pagar: {...dados_body.data.conta_pagar, _id: id}},
            });

            const new_conta_pagar = await model_conta_pagar.atualizar_pelo_id(dados_validados, c);

            const results = {
                data: {
                    conta_pagar: new_conta_pagar.data.conta_pagar,
                },
            };
            return helpers.set_response.c.SUCCESS({message: "Sucesso ao atualizar conta a pagar!", c: c, results: results});
        } catch (error) {
            return helpers.set_response.c.SERVER_ERROR({error, c});
        }
    }

    static async deletar_pelo_id(c: t.Context) {
        try {
            const id = c.req.param("id");

            const dados_body: t.Controllers.ContaPagar.DeletarPeloId.Input = {data: {_id: id}};

            const dados_validados = t.Controllers.ContaPagar.DeletarPeloId.InputSchema.parse(dados_body);

            await model_conta_pagar.deletar_pelo_id(dados_validados.data._id, c);

            const results = {
                data: {
                    conta_pagar: {},
                },
            };
            return helpers.set_response.c.SUCCESS({message: "Sucesso ao deletar conta a pagar!", c: c, results: results});
        } catch (error) {
            return helpers.set_response.c.SERVER_ERROR({error, c});
        }
    }
};

export default controller_conta_pagar;
