//BIBLIOTECAS
//HELPER
import helpers from "../../helpers/helpers";
//TYPE
import t from "../../../types";
//MODELS
import model_conta_pagar from "../../models/conta_pagar/model_conta_pagar";
import services_asaas_api from "../../services/asaas/api/services_asaas_api";

const controller_conta_pagar = class controller_conta_pagar {
    static async criar(c: t.Context) {
        try {
            const dados_body: t.Controllers.ContaPagar.Criar.Input = await c.req.json();

            const dados_validados = t.Controllers.ContaPagar.Criar.InputSchema.parse(dados_body);

            const new_conta_pagar = await model_conta_pagar.criar(dados_validados, c);

            // const pagar_pix_asaas = await services_asaas_api.transferencia.pagar_pix(new_conta_pagar, c);

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
                        _id: url.searchParams.get("_id"),
                        checkout: url.searchParams.get("checkout"),
                        cliente_id: url.searchParams.get("cliente_id"),
                        parcelas: parseInt(url.searchParams.get("parcelas") || ""),
                        valor: parseFloat(url.searchParams.get("valor") || ""),
                        vencimento: new Date(url.searchParams.get("vencimento") || ""),
                        codigo: url.searchParams.get("codigo"),
                        metodo_pagamento: url.searchParams.get("metodo_pagamento"),
                        tipo_pagamento: parseInt(url.searchParams.get("tipo_pagamento") || ""),
                        descricao: url.searchParams.get("descricao"),
                        referencia_externa_primaria: url.searchParams.get("referencia_externa_primaria"),
                        referencia_externa_secundaria: url.searchParams.get("referencia_externa_secundaria"),
                        referencia_externa_terciaria: url.searchParams.get("referencia_externa_terciaria"),
                        referencia_externa_quartenaria: url.searchParams.get("referencia_externa_quartenaria"),
                        documento_titular: url.searchParams.get("documento_titular"),
                        titular: url.searchParams.get("titular"),
                        status: parseInt(url.searchParams.get("status") || ""),
                        status_descricao: url.searchParams.get("status_descricao"),
                        pagamento_id: url.searchParams.get("pagamento_id"),
                        parcela: parseInt(url.searchParams.get("parcela") || ""),
                        valor_pacela: parseFloat(url.searchParams.get("valor_pacela") || ""),
                        usuario_create_id: url.searchParams.get("usuario_create_id"),
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
