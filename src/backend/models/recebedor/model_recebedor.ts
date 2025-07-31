import t from "../../../types";

import helpers from "../../helpers/helpers";

const model_recebedor = class model_recebedor {
    static async criar(data: t.Controllers.Recebedor.Criar.Input, c: t.Context): Promise<t.Controllers.Recebedor.Criar.Output> {
        const sql = helpers.conn_neon.get_connection(c.env);

        await this.CREATE_TABLE_IF_NOT_EXISTS(c);

        const user = c.get("usuario_auth");

        try {
            const result: any = await sql`
                INSERT INTO recebedor (
                    _id,
                    documento,
                    chave_pix,
                    tipo_de_chave,
                    referencia_externa,
                    razao_social,
                    nome,
                    ativo,
                    aplicativo,
                    data_criacao,
                    usuario_criacao
                ) VALUES (
                    uuid_generate_v4(),
                    ${data?.data?.recebedor?.documento},
                    ${data?.data?.recebedor?.chave_pix},
                    ${data?.data?.recebedor?.tipo_de_chave},
                    ${data?.data?.recebedor?.referencia_externa},
                    ${data?.data?.recebedor?.razao_social},
                    ${data?.data?.recebedor?.nome},
                    ${data?.data?.recebedor?.ativo},
                    ${user.app},
                    CURRENT_TIMESTAMP,
                    ${user._id}
                )
                RETURNING _id, documento, chave_pix, tipo_de_chave, referencia_externa, razao_social, nome, ativo, data_criacao, data_atualizacao, usuario_criacao, usuario_atualizacao, excluido, usuario_exclusao, data_exclusao;
            `;

            return {
                data: {
                    recebedor: result?.[0],
                },
            };
        } catch (error) {
            console.log(error, "error");
            return helpers.set_response.error.DATABASE_ERROR({message: "Erro ao criar recebedor!"}) as any;
        }
    }

    static async buscar_pelo_filtro(filtros: t.Controllers.Recebedor.BuscarPeloFiltro.Input, c: t.Context): Promise<t.Controllers.Recebedor.BuscarPeloFiltro.Output> {
        const sql = helpers.conn_neon.get_connection(c.env);

        const conditionStrings: string[] = [];
        const values: any[] = [];

        const s_filtros = filtros?.filtros?.recebedor;

        const paginaAtual = s_filtros?.pagina || 1;
        const itensPorPagina = 30;
        const offset = (paginaAtual - 1) * itensPorPagina;

        if (s_filtros?._id) {
            conditionStrings.push("r._id = $" + (values.length + 1));
            values.push(s_filtros?._id);
        }

        if (s_filtros?.documento) {
            conditionStrings.push("r.documento = $" + (values.length + 1));
            values.push(s_filtros.documento);
        }

        if (s_filtros?.chave_pix) {
            conditionStrings.push("r.chave_pix = $" + (values.length + 1));
            values.push(s_filtros.chave_pix);
        }

        if (s_filtros?.tipo_de_chave) {
            conditionStrings.push("r.tipo_de_chave = $" + (values.length + 1));
            values.push(s_filtros.tipo_de_chave);
        }

        if (s_filtros?.referencia_externa) {
            conditionStrings.push("r.referencia_externa = $" + (values.length + 1));
            values.push(s_filtros.referencia_externa);
        }

        if (s_filtros?.razao_social) {
            conditionStrings.push("r.razao_social = $" + (values.length + 1));
            values.push(s_filtros.razao_social);
        }

        if (s_filtros?.nome) {
            conditionStrings.push("r.nome = $" + (values.length + 1));
            values.push(s_filtros.nome);
        }

        if (s_filtros?.ativo !== undefined) {
            conditionStrings.push("r.ativo = $" + (values.length + 1));
            values.push(s_filtros.ativo);
        }

        if (s_filtros?.usuario_create_id) {
            conditionStrings.push("r.usuario_create_id = $" + (values.length + 1));
            values.push(s_filtros.usuario_create_id);
        }

        const queryString = `
            SELECT 
                r.*
            FROM 
                recebedor r
        `;

        const totalItensParaPaginacaoQuery = `
            SELECT 
                COUNT(*)::INTEGER as total_itens,
                CEIL(COUNT(*) / 30.0)::INTEGER as total_paginas
            FROM recebedor r
        `;

        let finalQuery = queryString;
        let finalQueryPaginacao = totalItensParaPaginacaoQuery;

        if (conditionStrings.length > 0) {
            const whereClause = " WHERE " + conditionStrings.join(" AND ");
            finalQuery += whereClause;
            finalQueryPaginacao += whereClause;
        }

        finalQuery += ` LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
        const valuesComPaginacao = [...values, itensPorPagina, offset];

        const [get_recebedor, [setPaginacao]]: any = await Promise.all([sql.query(finalQuery, valuesComPaginacao), sql.query(finalQueryPaginacao, values)]);

        return {
            data: {
                recebedor: get_recebedor,
                paginacao: {
                    total_itens: setPaginacao?.total_itens,
                    total_paginas: setPaginacao?.total_paginas,
                    total_itens_pagina_atual: get_recebedor?.length,
                    itens_por_pagina: itensPorPagina,
                },
            },
        };
    }

    static async buscar_pelo_id(props: t.Controllers.Recebedor.BuscarPeloId.Input, c: t.Context): Promise<t.Controllers.Recebedor.BuscarPeloId.Output> {
        const sql = helpers.conn_neon.get_connection(c.env);
        const result: any = await sql`
            SELECT 
                r.*
            FROM 
                recebedor r
            WHERE r._id = ${props.data._id}
            AND r.excluido IS FALSE
        `;

        return {
            data: {
                recebedor: result[0],
            },
        };
    }

    static async atualizar_pelo_id(data: t.Controllers.Recebedor.AtualizarPeloId.Input, c: t.Context): Promise<t.Controllers.Recebedor.AtualizarPeloId.Output> {
        try {
            const sql = helpers.conn_neon.get_connection(c.env);
            const updates: string[] = [];
            const values: any[] = [];

            const user = c.get("usuario_auth");

            const fields = data.data.recebedor;

            if (fields?.documento !== undefined) {
                updates?.push(`documento = $${updates?.length + 1}`);
                values.push(fields?.documento);
            }

            if (fields?.chave_pix !== undefined) {
                updates?.push(`chave_pix = $${updates?.length + 1}`);
                values.push(fields?.chave_pix);
            }

            if (fields?.tipo_de_chave !== undefined) {
                updates?.push(`tipo_de_chave = $${updates?.length + 1}`);
                values.push(fields?.tipo_de_chave);
            }

            if (fields?.referencia_externa !== undefined) {
                updates?.push(`referencia_externa = $${updates?.length + 1}`);
                values.push(fields?.referencia_externa);
            }

            if (fields?.razao_social !== undefined) {
                updates?.push(`razao_social = $${updates?.length + 1}`);
                values.push(fields?.razao_social);
            }

            if (fields?.nome !== undefined) {
                updates?.push(`nome = $${updates?.length + 1}`);
                values.push(fields?.nome);
            }

            if (fields?.ativo !== undefined) {
                updates?.push(`ativo = $${updates?.length + 1}`);
                values.push(fields?.ativo);
            }

            updates?.push(
                `
                    data_atualizacao = CURRENT_TIMESTAMP,
                    usuario_atualizacao = ${user._id}
                `
            );

            const setClause = updates?.join(", ");

            const dados_atualizados = await sql.query(
                `
                    UPDATE recebedor SET ${setClause} 
                    WHERE _id = $${values.length + 1}
                    RETURNING *;
                `,
                [...values, data.data.recebedor._id]
            );

            return {
                data: {
                    recebedor: dados_atualizados?.[0] as t.Controllers.Recebedor.AtualizarPeloId.Output["data"]["recebedor"],
                },
            };
        } catch (error) {
            return helpers.set_response.error.DATABASE_ERROR({message: "Erro ao atualizar campos no model recebedor!"}) as any;
        }
    }

    static async deletar_pelo_id(id: string, c: t.Context): Promise<t.Controllers.Recebedor.DeletarPeloId.Output> {
        const sql = helpers.conn_neon.get_connection(c.env);

        const result = await sql`
            UPDATE recebedor 
            SET 
                excluido = TRUE,
                data_exclusao = NOW()
            WHERE _id = ${id}
            AND excluido = FALSE
            RETURNING *
        `;

        return {
            data: {
                recebedor: result[0],
            },
        };
    }

    static async CREATE_TABLE_IF_NOT_EXISTS(c: t.Context) {
        const sql = helpers.conn_neon.get_connection(c.env);

        await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`;

        await sql`
            CREATE TABLE IF NOT EXISTS recebedor (
                -- colunas padrões
                _id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
                usuario_criacao TEXT,
                data_atualizacao TIMESTAMP WITH TIME ZONE,
                usuario_atualizacao TEXT,
                excluido BOOLEAN DEFAULT FALSE NOT NULL,
                usuario_exclusao TEXT,
                data_exclusao TIMESTAMP WITH TIME ZONE,
                aplicativo TEXT NOT NULL,
                -- fim colunas padrões
                documento TEXT NOT NULL,
                chave_pix TEXT NOT NULL,
                tipo_de_chave TEXT NOT NULL,
                referencia_externa TEXT NOT NULL,
                razao_social TEXT NOT NULL,
                nome TEXT NOT NULL,
                ativo BOOLEAN DEFAULT TRUE NOT NULL
            )
        `;
    }
};

export default model_recebedor;
