//BIBLIOTECAS
//HELPER
import helpers from "../../helpers/helpers";
//TYPE
import t from "../../../types";

//MODELS
import model_recebedor from "../../models/recebedor/model_recebedor";
import services_asaas_api from "../../services/asaas/api/services_asaas_api";

const controller_recebedor = class controller_recebedor {
    static async criar(c: t.Context) {
        try {
            const user = c.get("usuario_auth");

            const dados_body: t.Controllers.Recebedor.Criar.Input = await c.req.json();

            dados_body.data.recebedor.referencia_externa = user._id.toString();

            const dados_validados = t.Controllers.Recebedor.Criar.InputSchema.parse(dados_body);

            const new_recebedor = await model_recebedor.criar(dados_validados, c);

            // const criar_transferencia_asaas = await services_asaas_api.transferencia.pagar_pix(dados_validados, c);
            // console.log(criar_transferencia_asaas, "criar_transferencia_asaas");

            const results = {
                data: {
                    recebedor: new_recebedor.data.recebedor,
                },
            };
            return helpers.set_response.c.CREATED({message: "Sucesso ao criar recebedor!", c: c, results: results});
        } catch (error) {
            return helpers.set_response.c.SERVER_ERROR({error, c});
        }
    }

    static async buscar_pelo_id(c: t.Context) {
        try {
            const id = c.req.param("id");

            const dados_validados = t.Controllers.Recebedor.BuscarPeloId.InputSchema.parse({data: {_id: id}});

            const new_recebedor = await model_recebedor.buscar_pelo_id({data: {_id: dados_validados.data._id}}, c);

            if (!new_recebedor?.data?.recebedor?._id) {
                return helpers.set_response.c.NOT_FOUND({message: "Recebedor não encontrado", c: c});
            }

            const results = {
                data: {
                    recebedor: new_recebedor.data.recebedor,
                },
            };
            return helpers.set_response.c.SUCCESS({message: "Sucesso ao buscar recebedor!", c: c, results: results});
        } catch (error) {
            return helpers.set_response.c.SERVER_ERROR({error, c});
        }
    }

    static async buscar_pelo_filtro(c: t.Context) {
        try {
            const url = new URL(c.req.url);
            const filtros: t.Controllers.Recebedor.BuscarPeloFiltro.Input = {
                filtros: {
                    recebedor: {
                        pagina: parseInt(url.searchParams.get("pagina") || "1"),
                        documento: url.searchParams.get("documento"),
                        chave_pix: url.searchParams.get("chave_pix"),
                        tipo_de_chave: url.searchParams.get("tipo_de_chave"),
                        referencia_externa: url.searchParams.get("referencia_externa"),
                        razao_social: url.searchParams.get("razao_social"),
                        nome: url.searchParams.get("nome"),
                        ativo: url.searchParams.get("ativo") === "true" ? true : url.searchParams.get("ativo") === "false" ? false : undefined,
                        usuario_create_id: url.searchParams.get("usuario_create_id"),
                    },
                },
            };

            const dados_validados = t.Controllers.Recebedor.BuscarPeloFiltro.InputSchema.parse(filtros);

            const get_recebedor = await model_recebedor.buscar_pelo_filtro(dados_validados, c);

            const results = {
                data: {
                    recebedor: get_recebedor.data.recebedor,
                    paginacao: get_recebedor.data.paginacao,
                },
            };
            return helpers.set_response.c.SUCCESS({message: "Sucesso ao buscar recebedor!", c: c, results: results});
        } catch (error) {
            return helpers.set_response.c.SERVER_ERROR({error, c});
        }
    }

    static async atualizar_pelo_id(c: t.Context) {
        try {
            const id = c.req.param("id");
            const dados_body: t.Controllers.Recebedor.AtualizarPeloId.Input = await c.req.json();

            const dados_validados = t.Controllers.Recebedor.AtualizarPeloId.InputSchema.parse({
                ...dados_body,
                data: {recebedor: {...dados_body.data.recebedor, _id: id}},
            });

            const new_recebedor = await model_recebedor.atualizar_pelo_id(dados_validados, c);

            const results = {
                data: {
                    recebedor: new_recebedor.data.recebedor,
                },
            };

            return helpers.set_response.c.SUCCESS({message: "Sucesso ao atualizar recebedor!", c: c, results: results});
        } catch (error) {
            return helpers.set_response.c.SERVER_ERROR({error, c});
        }
    }

    static async deletar_pelo_id(c: t.Context) {
        try {
            const id = c.req.param("id");

            const dados_validados = t.Controllers.Recebedor.DeletarPeloId.InputSchema.parse({_id: id});

            await model_recebedor.deletar_pelo_id(dados_validados.data._id, c);

            const results = {
                data: {
                    recebedor: {},
                },
            };
            return helpers.set_response.c.SUCCESS({message: "Sucesso ao deletar recebedor!", c: c, results: results});
        } catch (error) {
            return helpers.set_response.c.SERVER_ERROR({error, c});
        }
    }
};

export default controller_recebedor;
