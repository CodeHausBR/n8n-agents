import {neon, neonConfig} from "@neondatabase/serverless";
import t from "../../../types";

import helpers from "../../helpers/helpers";

const ModelHelpers = class ModelHelpers {
    static async criar(data: t.Controllers.Helpers.Criar.Input, c: t.Context): Promise<t.Controllers.Helpers.Criar.Output> {
        const sql = helpers.conn_neon.get_connection(c.env);

        await this.CREATE_TABLE_IF_NOT_EXISTS(c);

        try {
            const result: any = await sql`
                INSERT INTO helpers (
                    descricao,
                    permissao,
                    setor,
                    data_criacao
                ) VALUES (
                    ${data?.data?.helper?.descricao},
                    ${data?.data?.helper?.permissao},
                    ${data?.data?.helper?.setor},
                    CURRENT_TIMESTAMP
                )
                RETURNING _id, descricao, permissao, setor, data_criacao;
            `;

            return {
                data: {
                    helper: result?.[0],
                },
            };
        } catch (error) {
            return helpers.set_response.error.DATABASE_ERROR({message: "Erro ao criar helper!"}) as any;
        }
    }

    static async buscar_pelo_filtro(filtros: t.Controllers.Helpers.BuscarPeloFiltro.Input, c: t.Context): Promise<t.Controllers.Helpers.BuscarPeloFiltro.Output> {
        const sql = helpers.conn_neon.get_connection(c.env);

        const conditionStrings: string[] = [];
        const values: any[] = [];

        const h_filtros = filtros?.filtros?.helper;

        if (h_filtros?._id) {
            conditionStrings.push("h._id = $" + (values.length + 1));
            values.push(h_filtros?._id);
        }

        if (h_filtros?.descricao) {
            conditionStrings.push("h.descricao = $" + (values.length + 1));
            values.push(h_filtros.descricao);
        }

        if (h_filtros?.permissao) {
            conditionStrings.push("h.permissao = $" + (values.length + 1));
            values.push(h_filtros.permissao);
        }

        if (h_filtros?.setor) {
            conditionStrings.push("h.setor = $" + (values.length + 1));
            values.push(h_filtros.setor);
        }

        const queryString = `
        SELECT 
            h.*
        FROM 
            helpers h
    `;

        let finalQuery = queryString;
        if (conditionStrings.length > 0) {
            finalQuery += " WHERE " + conditionStrings.join(" AND ");
        }

        const get_helpers: any = await sql.query(finalQuery, values);

        return {
            data: {
                helpers: get_helpers,
            },
        };
    }

    static async buscar_pelo_id(props: t.Controllers.Helpers.BuscarPeloId.Input, c: t.Context): Promise<t.Controllers.Helpers.BuscarPeloId.Output> {
        const sql = helpers.conn_neon.get_connection(c.env);
        const result: any = await sql`
            SELECT 
                h.*
            FROM 
                helpers h
            WHERE h._id = ${props.data._id}
            AND h.delete IS FALSE
        `;

        return {
            data: {
                helper: result[0],
            },
        };
    }

    static async atualizar_pelo_id(data: t.Controllers.Helpers.AtualizarPeloId.Input, c: t.Context): Promise<t.Controllers.Helpers.BuscarPeloId.Output> {
        try {
            const sql = helpers.conn_neon.get_connection(c.env);
            const updates: string[] = [];
            const values: any[] = [];

            const fields = data.data.helper;

            if (fields?.descricao !== undefined) {
                updates?.push(`descricao = $${updates?.length + 1}`);
                values.push(fields?.descricao);
            }

            if (fields?.permissao !== undefined) {
                updates?.push(`permissao = $${updates?.length + 1}`);
                values.push(fields?.permissao);
            }

            if (fields?.setor !== undefined) {
                updates?.push(`setor = $${updates?.length + 1}`);
                values.push(fields?.setor);
            }

            updates?.push(`data_atualizacao = CURRENT_TIMESTAMP`);

            const setClause = updates?.join(", ");

            await sql.query(
                `
                UPDATE helpers SET ${setClause} 
                WHERE _id = $${values.length + 1}
                RETURNING *;
            `,
                [...values, data.data.helper._id]
            );

            return await ModelHelpers.buscar_pelo_id({data: {_id: data.data.helper._id}}, c);
        } catch (error) {
            return helpers.set_response.error.DATABASE_ERROR({message: "Erro ao atualizar campos no model helpers!"}) as any;
        }
    }

    static async deletar_pelo_id(id: string, c: t.Context): Promise<t.Controllers.Helpers.DeletarPeloId.Output> {
        const sql = helpers.conn_neon.get_connection(c.env);

        const result = await sql`
            UPDATE helpers 
            SET 
                delete = TRUE,
                data_atualizacao = NOW()
            WHERE _id = ${id}
            AND delete = FALSE
            RETURNING *
        `;

        return {
            data: {
                helper: result[0],
            },
        };
    }

    static async CREATE_TABLE_IF_NOT_EXISTS(c: t.Context) {
        const sql = helpers.conn_neon.get_connection(c.env);

        await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`;

        await sql`
            CREATE TABLE IF NOT EXISTS helpers (
                -- colunas padrões
                _id SERIAL PRIMARY KEY,
                data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
                data_atualizacao TIMESTAMP WITH TIME ZONE,
                delete BOOLEAN DEFAULT FALSE NOT NULL,
                -- fim colunas padrões
                descricao TEXT NOT NULL,
                permissao INTEGER NOT NULL,
                setor TEXT NOT NULL
            )
        `;
    }
};

export default ModelHelpers;
