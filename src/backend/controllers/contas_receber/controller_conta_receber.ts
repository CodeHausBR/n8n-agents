//BIBLIOTECAS
//HELPER
import helpers from "../../helpers/helpers";
//TYPE
import t from "../../../types";
//SERVICES

import services_conta_receber from "../../services/conta_receber/services_conta_receber";
//MODELS
import model_conta_receber from "../../models/conta_receber/model_conta_receber";
import utils_gerar_uuid_v4 from "../../utils/utils_gerar_uuid_v4";
import controller_cliente from "../cliente/controller_cliente";

const controller_conta_receber = class controller_conta_receber {
    static async criar(c: t.Context) {
        try {
            const dados_body: t.Controllers.ContaReceber.Criar.Input = await c.req.json();
            const dados_validados = t.Controllers.ContaReceber.Criar.InputSchema.parse(dados_body);

            dados_validados.data.conta_receber.codigo = await utils_gerar_uuid_v4();

            dados_validados.data.conta_receber.metadata = {...dados_validados?.data?.conta_receber?.metadata, v: "2.0", gerarAnexo1: "true"};

            const original_param = c.req.param;

            c.req.param = ((key?: string) => {
                if (!key) return original_param();
                if (key === "id") return dados_validados?.data?.conta_receber?.cliente_id;
                return original_param(key);
            }) as typeof c.req.param;

            const result: any = await controller_cliente.buscar_pelo_id(c);

            const cliente = await result.json();

            if (cliente?.status !== 200 && cliente?.results?.data?.length > 0) helpers.set_response.c.WARNING({c: c, message: "Cliente não encontrado"});

            const pedido_gerado_na_plataforma = await services_conta_receber.selecionar_checkout_criar(dados_validados, cliente?.results, c);

            const nova_conta_receber = await model_conta_receber.criar(pedido_gerado_na_plataforma, cliente?.results, c);

            const set_nova_conta_receber = await model_conta_receber.buscar_pelo_id({data: {_id: nova_conta_receber.data.conta_receber._id, excluido: false}}, c);

            const results = {
                data: {
                    conta_receber: set_nova_conta_receber?.data.conta_receber,
                },
            };

            return helpers.set_response.c.CREATED({message: "Sucesso ao criar conta_receber!", c: c, results: results});
        } catch (erro) {
            return helpers.set_response.c.SERVER_ERROR({error: erro, c: c});
        }
    }

    static async buscar_pelo_id(c: t.Context) {
        try {
            const id = c.req.param("id");
            const url = new URL(c.req.url);
            const excluido = url.searchParams.get("excluido") === "true" ? true : false;
            const dados_validados = t.Controllers.ContaReceber.BuscarPeloId.InputSchema.parse({data: {_id: id, excluido: excluido}});

            const new_conta_receber = await model_conta_receber.buscar_pelo_id(dados_validados, c);

            const results = {
                data: {
                    conta_receber: new_conta_receber.data.conta_receber,
                },
            };
            return helpers.set_response.c.SUCCESS({message: "Sucesso ao buscar conta_receber!", c: c, results: results});
        } catch (erro) {
            return helpers.set_response.c.SERVER_ERROR({error: erro, c: c});
        }
    }

    static async buscar_pelo_filtro(c: t.Context) {
        try {
            const url = new URL(c.req.url);

            const filtros: t.Controllers.ContaReceber.BuscarPeloFiltro.Input = {
                filtros: {
                    conta_receber: {
                        // Se "pagina" for null/vazio, usa "1" por padrão
                        pagina: parseInt(url.searchParams.get("pagina") || "1"),

                        // Para campos que aceitam string ou undefined (se a API permitir opcional)
                        _id: url.searchParams.get("_id") || undefined, // Se for null, vira undefined
                        checkout: url.searchParams.get("checkout") || undefined,
                        cliente_id: url.searchParams.get("cliente_id") || undefined,

                        // Para parcelas, valor, tipo_pagamento e status, trate NaN
                        parcelas: url.searchParams.get("parcelas") ? parseInt(url.searchParams.get("parcelas")!) : undefined,
                        valor: url.searchParams.get("valor") ? parseFloat(url.searchParams.get("valor")!) : undefined,
                        vencimento: url.searchParams.get("vencimento") || undefined,
                        codigo: url.searchParams.get("codigo") || undefined,

                        // Onde estava o problema do JSON.parse:
                        metodo_pagamento: url.searchParams.get("metodo_pagamento") as t.Controllers.ContaReceber.MetodoPagamento,

                        tipo_pagamento: url.searchParams.get("tipo_pagamento") ? parseInt(url.searchParams.get("tipo_pagamento")!) : undefined,
                        descricao: url.searchParams.get("descricao") || undefined,
                        referencia_externa_primaria: url.searchParams.get("referencia_externa_primaria") || undefined,
                        referencia_externa_secundaria: url.searchParams.get("referencia_externa_secundaria") || undefined,
                        referencia_externa_terciaria: url.searchParams.get("referencia_externa_terciaria") || undefined,
                        referencia_externa_quartenaria: url.searchParams.get("referencia_externa_quartenaria") || undefined,

                        // Ativo: tratamento para "true", "false" ou undefined
                        ativo: url.searchParams.get("ativo") === "true" ? true : url.searchParams.get("ativo") === "false" ? false : undefined,

                        documento_titular: url.searchParams.get("documento_titular") || undefined,
                        titular: url.searchParams.get("titular") || undefined,
                        status: url.searchParams.get("status") ? parseInt(url.searchParams.get("status")!) : undefined,
                        numero_cartao: url.searchParams.get("numero_cartao") || undefined,
                        numero_serial: url.searchParams.get("numero_serial") || undefined,
                        pagamento_id: url.searchParams.get("pagamento_id") || undefined,
                        parcela: url.searchParams.get("parcela") ? parseInt(url.searchParams.get("parcela")!) : undefined,
                        valor_pacela: url.searchParams.get("valor_pacela") ? parseFloat(url.searchParams.get("valor_pacela")!) : undefined,
                        url_pedido: url.searchParams.get("url_pedido") || undefined,
                        url_cobranca: url.searchParams.get("url_cobranca") || undefined,
                        usuario_create_id: url.searchParams.get("usuario_create_id") || undefined,
                        // Excluido: tratamento para boolean
                        excluido: url.searchParams.get("excluido") === "true", // Já que você quer false se não for "true"
                    },
                },
            };
            console.log(filtros, "filtros");

            const dados_validados = t.Controllers.ContaReceber.BuscarPeloFiltro.InputSchema.parse(filtros);
            console.log("1");

            const get_conta_receber = await model_conta_receber.buscar_pelo_filtro(dados_validados, c);
            console.log("2");
            const results = {
                data: {
                    conta_receber: get_conta_receber.data.conta_receber,
                    paginacao: get_conta_receber.data.paginacao,
                },
            };
            console.log("3");
            return helpers.set_response.c.SUCCESS({message: "Sucesso ao buscar conta_receber!", c: c, results: results});
        } catch (erro) {
            console.log(erro, "erro");

            return helpers.set_response.c.SERVER_ERROR({error: erro, c: c});
        }
    }

    static async atualizar_pelo_id(c: t.Context) {
        try {
            const id = c.req.param("id");
            const dados_body: t.Controllers.ContaReceber.AtualizarPeloId.Input = await c.req.json();

            const dados_validados = t.Controllers.ContaReceber.AtualizarPeloId.InputSchema.parse({
                ...dados_body,
                data: {conta_receber: {...dados_body.data.conta_receber, _id: id}},
            });

            const new_conta_receber = await model_conta_receber.atualizar_pelo_id(dados_validados, c);

            const results = {
                data: {
                    conta_receber: new_conta_receber.data.conta_receber,
                },
            };
            return helpers.set_response.c.SUCCESS({message: "Sucesso ao atualizar conta_receber!", c: c, results: results});
        } catch (erro) {
            return helpers.set_response.c.SERVER_ERROR({error: erro, c: c});
        }
    }

    static async deletar_pelo_id(c: t.Context) {
        try {
            const id = c.req.param("id");

            const dados_validados = t.Controllers.ContaReceber.DeletarPeloId.InputSchema.parse({data: {_id: id}});

            const buscar_registro_pelo_id: any = await controller_conta_receber.buscar_pelo_id(c);

            const resultado_busca = await buscar_registro_pelo_id.json();

            const conta_receber: t.Controllers.ContaReceber.BuscarPeloId.Output = resultado_busca?.results;

            await services_conta_receber.regras.verificar_status_da_conta_receber_antes_de_cancelar(conta_receber);

            await services_conta_receber.selecionar_checkout_deletar(conta_receber, c);

            await model_conta_receber.deletar_pelo_id(dados_validados.data._id, c);

            const results = {
                data: {
                    conta_receber: {},
                },
            };

            return helpers.set_response.c.SUCCESS({message: "Sucesso ao deletar conta_receber!", c: c, results: results});
        } catch (erro) {
            return helpers.set_response.c.SERVER_ERROR({error: erro, c: c});
        }
    }
};

export default controller_conta_receber;
