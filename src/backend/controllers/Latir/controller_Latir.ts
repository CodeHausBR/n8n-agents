typescript
//BIBLIOTECAS
//HELPER
import helpers from "helpers/helpers";
//TYPE
import t from "onda-types";
//MODELS
import model_latir from "mvc/models/model_latir";


const controller_latir = class controller_latir {
    static async criar(c: t.Banco.Context) {
        try {
            const dados_body: t.Cachorro.Controllers.Latir.Criar.Input = await c.req.json();

            const dados_validados = t.Cachorro.Controllers.Latir.Criar.InputSchema.parse(dados_body)

            const new_latir = await model_latir.criar(dados_validados, c);

            const results = {
                data: {
                    latir: new_latir.data.latir
                }
            }
            return helpers.set_response.c.CREATED({ message: "Sucesso ao criar latir!", c: c, results: results });
        } catch (erro) {
            return helpers.set_response.c.SERVER_ERROR(erro, c);
        }
    }

    static async buscar_pelo_id(c: t.Banco.Context) {
        try {
            const id = c.req.param("id");

            const dados_validados = t.Cachorro.Controllers.Latir.BuscarPeloId.InputSchema.parse({ data: { id: id } })

            const new_latir = await model_latir.buscar_pelo_id({ data: { id: dados_validados.data.id } }, c);

            const results = {
                data: {
                    latir: new_latir.data.latir
                }
            }
            return helpers.set_response.c.SUCCESS({ message: "Sucesso ao buscar latir!", c: c, results: results });
        } catch (erro) {
            return helpers.set_response.c.SERVER_ERROR(erro, c);
        }
    }

    static async buscar_pelo_filtro(c: t.Banco.Context) {
        try {
            const url = new URL(c.req.url);
            const filtros: t.Banco.Controllers.Latir.BuscarPeloFiltro.Input = {
                filtros: {
                    latir: {
                        descricao: url.searchParams.get("descricao"),
                        tipo: url.searchParams.get("tipo"),
                        valor: url.searchParams.get("valor") ? parseFloat(url.searchParams.get("valor")) : undefined,
                        data: url.searchParams.get("data"),
                        categoria: url.searchParams.get("categoria"),
                        usuario_id: url.searchParams.get("usuario_id") ? parseInt(url.searchParams.get("usuario_id")) : undefined,
                        raca: url.searchParams.get("raca"),
                        idade: url.searchParams.get("idade"),
                        pagina: url.searchParams.get("pagina") ? parseInt(url.searchParams.get("pagina")) : undefined,
                    }
                }
            };

            const dados_validados = t.Banco.Controllers.Latir.BuscarPeloFiltro.InputSchema.parse(filtros)

            const get_latir = await model_latir.buscar_pelo_filtro(dados_validados, c);

            const results = {
                data: {
                    latir: get_latir.data.latir,
                    paginacao: get_latir.data.paginacao
                }
            }
            return helpers.set_response.c.SUCCESS({ message: "Sucesso ao buscar latir com filtros!", c: c, results: results });
        } catch (erro) {
            return helpers.set_response.c.SERVER_ERROR(erro, c);
        }
    }

    static async atualizar_pelo_id(c: t.Banco.Context) {
        try {
            const id = c.req.param("id");
            const dados_body: t.Banco.Controllers.Latir.AtualizarPeloId.Input = await c.req.json();

            const dados_validados = t.Banco.Controllers.Latir.AtualizarPeloId.InputSchema.parse({ ...dados_body, data: { latir: { ...dados_body.data.latir, id: id } } })

            const new_latir = await model_latir.atualizar_pelo_id(dados_validados, c);

            const results = {
                data: {
                    latir: new_latir.data.latir
                }
            }
            return helpers.set_response.c.SUCCESS({ message: "Sucesso ao atualizar latir!", c: c, results: results });
        } catch (erro) {
            return helpers.set_response.c.SERVER_ERROR(erro, c);
        }
    }

    static async deletar_pelo_id(c: t.Banco.Context) {
        try {
            const id = c.req.param("id");

            const dados_validados = t.Banco.Controllers.Latir.DeletarPeloId.InputSchema.parse({ id: id })

            const new_latir = await model_latir.deletar_pelo_id(dados_validados.id, c);

            const results = {
                data: {
                    latir: {}
                }
            }
            return helpers.set_response.c.SUCCESS({ message: "Sucesso ao deletar latir!", c: c, results: results });
        } catch (erro) {
            return helpers.set_response.c.SERVER_ERROR(erro, c);
        }
    }
};

export default controller_latir;
