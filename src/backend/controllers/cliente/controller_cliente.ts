//BIBLIOTECAS
//HELPER
import helpers from "../../helpers/helpers";
//TYPE
import t from "../../../types";
//MODELS
import model_cliente from "../../models/cliente/model_cliente";

//SERVICES
import services_asaas_api from "../../services/asaas/api/services_asaas_api";
import services_pagarme_api from "../../services/pagarme/api/services_pagarme_api";

const controller_cliente = class controller_cliente {
    static async criar(c: t.Context) {
        try {
            const dados_body: t.Controllers.Cliente.Criar.Input = await c.req.json();

            const dados_validados = t.Controllers.Cliente.Criar.InputSchema.parse(dados_body);

            const verificar_se_cliente_ja_existe = await model_cliente.buscar_pelo_filtro(
                {
                    filtros: {
                        cliente: {
                            pagina: 1,
                            cpf_cnpj: dados_validados.data.cliente.cpf_cnpj,
                        },
                    },
                },
                c
            );

            if (verificar_se_cliente_ja_existe.data.cliente.length > 0) return helpers.set_response.WARNING({message: "Cliente já existe!"});
            const new_cliente = await model_cliente.criar(dados_validados, c);

            const [cliente_asaas, cliente_pagarme] = await Promise.all([
                await services_asaas_api.cliente.criar(new_cliente, c),
                await services_pagarme_api.cliente.criar(new_cliente, c),
            ]);

            const set_update_cliente: t.Controllers.Cliente.AtualizarPeloId.Input = {
                data: {
                    cliente: {
                        _id: new_cliente.data.cliente._id,
                        asaas_external_id: cliente_asaas.data.cliente.id,
                        pagarme_external_id: cliente_pagarme.data.cliente.id,
                    },
                },
            };

            const update_cliente = await model_cliente.atualizar_pelo_id(set_update_cliente, c);

            const results = {
                data: {
                    cliente: update_cliente.data.cliente,
                },
            };
            return helpers.set_response.c.CREATED({message: "Sucesso ao criar cliente!", c: c, results: results});
        } catch (erro) {
            return helpers.set_response.c.SERVER_ERROR({error: erro, c: c});
        }
    }

    static async buscar_pelo_id(c: t.Context) {
        try {
            const id = c.req.param("id");

            const dados_validados = t.Controllers.Cliente.BuscarPeloId.InputSchema.parse({data: {_id: id}});

            const new_cliente = await model_cliente.buscar_pelo_id({data: {_id: dados_validados.data._id}}, c);

            const results = {
                data: {
                    cliente: new_cliente.data.cliente,
                },
            };
            return helpers.set_response.c.SUCCESS({message: "Sucesso ao buscar cliente!", c: c, results: results});
        } catch (erro) {
            return helpers.set_response.c.SERVER_ERROR({error: erro, c: c});
        }
    }

    static async buscar_pelo_filtro(c: t.Context) {
        try {
            const url = new URL(c.req.url);
            const filtros: t.Controllers.Cliente.BuscarPeloFiltro.Input = {
                filtros: {
                    cliente: {
                        pagina: parseInt(url.searchParams.get("pagina") || "1"),
                        _id: url.searchParams.get("_id"),
                        nome: url.searchParams.get("nome"),
                        email: url.searchParams.get("email"),
                        referencia_externa: url.searchParams.get("referencia_externa"),
                        cpf_cnpj: url.searchParams.get("cpf_cnpj"),
                        tipo: url.searchParams.get("tipo") as t.Controllers.Cliente.ClienteTipo,
                        genero: url.searchParams.get("genero") as t.Controllers.Cliente.ClienteGenero,
                        data_nascimento: url.searchParams.get("data_nascimento"),
                        endereco: url.searchParams.get("endereco"),
                        complemento: url.searchParams.get("complemento"),
                        cep: url.searchParams.get("cep"),
                        cidade: url.searchParams.get("cidade"),
                        estado: url.searchParams.get("estado"),
                        pais: url.searchParams.get("pais"),
                        telefone: url.searchParams.get("telefone"),
                        celular: url.searchParams.get("celular"),
                        excluido: url.searchParams.get("excluido") === "true" ? true : false,
                        usuario_criacao: url.searchParams.get("usuario_criacao"),
                    },
                },
            };

            const dados_validados = t.Controllers.Cliente.BuscarPeloFiltro.InputSchema.parse(filtros);

            const get_clientes = await model_cliente.buscar_pelo_filtro(dados_validados, c);

            const results = {
                data: {
                    paginacao: get_clientes.data.paginacao,
                    cliente: get_clientes.data.cliente,
                },
            };
            return helpers.set_response.c.SUCCESS({message: "Sucesso ao buscar cliente!", c: c, results: results});
        } catch (erro) {
            return helpers.set_response.c.SERVER_ERROR({error: erro, c: c});
        }
    }

    static async atualizar_pelo_id(c: t.Context) {
        try {
            const id = c.req.param("id");
            const dados_body: t.Controllers.Cliente.AtualizarPeloId.Input = await c.req.json();

            const dados_validados = t.Controllers.Cliente.AtualizarPeloId.InputSchema.parse({...dados_body, data: {cliente: {...dados_body.data.cliente, _id: id}}});

            const new_cliente = await model_cliente.atualizar_pelo_id(dados_validados, c);

            const results = {
                data: {
                    cliente: new_cliente.data.cliente,
                },
            };
            return helpers.set_response.c.SUCCESS({message: "Sucesso ao atualizar cliente!", c: c, results: results});
        } catch (erro) {
            return helpers.set_response.c.SERVER_ERROR({error: erro, c: c});
        }
    }

    static async deletar_pelo_id(c: t.Context) {
        try {
            const id = c.req.param("id");

            const dados_body: t.Controllers.Cliente.DeletarPeloId.Input = {data: {_id: id}};

            const dados_validados = t.Controllers.Cliente.DeletarPeloId.InputSchema.parse(dados_body);

            await model_cliente.deletar_pelo_id(dados_validados.data._id, c);

            const results = {
                data: {
                    cliente: {},
                },
            };
            return helpers.set_response.c.SUCCESS({message: "Sucesso ao deletar cliente!", c: c, results: results});
        } catch (erro) {
            return helpers.set_response.c.SERVER_ERROR({error: erro, c: c});
        }
    }
};

export default controller_cliente;
