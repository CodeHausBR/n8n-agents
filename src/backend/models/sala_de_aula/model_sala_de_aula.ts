import t from "../../../types";

import helpers from "../../helpers/helpers";

const model_sala_de_aula = class model_sala_de_aula {
    static async criar(data: t.Controllers.SalaDeAula.Criar.Input, c: t.Context): Promise<t.Controllers.SalaDeAula.Criar.Output> {
        const sql = helpers.conn_neon.get_connection(c.env);

        await this.CREATE_TABLE_IF_NOT_EXISTS(c);

        const user = c.get("usuario_auth");

        try {
            const result: any = await sql`
                INSERT INTO sala_de_aula (
                    _id,
                    sala,
                    quantidade_de_lugares,
                    andar,
                    tipo,
                    disponivel,
                    data_criacao,
                    aplicativo,
                    usuario_criacao
                ) VALUES (
                    uuid_generate_v4(),
                    ${data?.data?.sala_de_aula?.sala},
                    ${data?.data?.sala_de_aula?.quantidade_de_lugares},
                    ${data?.data?.sala_de_aula?.andar},
                    ${data?.data?.sala_de_aula?.tipo},
                    ${data?.data?.sala_de_aula?.disponivel},
                    CURRENT_TIMESTAMP,
                    ${user.app},
                    ${user._id.toString()}
                )
                RETURNING _id, sala, quantidade_de_lugares, andar, tipo, disponivel, data_criacao, data_atualizacao, usuario_criacao, usuario_atualizacao, excluido, usuario_exclusao, data_exclusao ;
            `;

            return {
                data: {
                    sala_de_aula: result?.[0],
                },
            };
        } catch (error) {
            return helpers.set_response.error.DATABASE_ERROR({message: "Erro ao criar sala de aula!"}) as any;
        }
    }

    static async buscar_pelo_filtro(filtros: t.Controllers.SalaDeAula.BuscarPeloFiltro.Input, c: t.Context): Promise<t.Controllers.SalaDeAula.BuscarPeloFiltro.Output> {
        const sql = helpers.conn_neon.get_connection(c.env);

        const conditionStrings: string[] = [];
        const values: any[] = [];

        const s_filtros = filtros?.filtros?.sala_de_aula;

        const paginaAtual = s_filtros?.pagina || 1;
        const itensPorPagina = 30;
        const offset = (paginaAtual - 1) * itensPorPagina;

        if (s_filtros?._id) {
            conditionStrings.push("s._id = $" + (values.length + 1));
            values.push(s_filtros?._id);
        }

        if (s_filtros?.sala) {
            conditionStrings.push("s.sala = $" + (values.length + 1));
            values.push(s_filtros.sala);
        }

        if (s_filtros?.quantidade_de_lugares) {
            conditionStrings.push("s.quantidade_de_lugares = $" + (values.length + 1));
            values.push(s_filtros.quantidade_de_lugares);
        }

        if (s_filtros?.andar) {
            conditionStrings.push("s.andar = $" + (values.length + 1));
            values.push(s_filtros.andar);
        }

        if (s_filtros?.tipo) {
            conditionStrings.push("s.tipo = $" + (values.length + 1));
            values.push(s_filtros.tipo);
        }

        if (s_filtros?.disponivel !== undefined && s_filtros?.disponivel !== null) {
            conditionStrings.push("s.disponivel = $" + (values.length + 1));
            values.push(s_filtros.disponivel);
        }

        if (s_filtros?.usuario_create_id) {
            conditionStrings.push("s.usuario_create_id = $" + (values.length + 1));
            values.push(s_filtros.usuario_create_id);
        }

        const queryString = `
            SELECT 
                s.*
            FROM 
                sala_de_aula s
        `;

        const totalItensParaPaginacaoQuery = `
            SELECT 
                COUNT(*)::INTEGER as total_itens,
                CEIL(COUNT(*) / 30.0)::INTEGER as total_paginas
            FROM sala_de_aula s
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

        const [get_sala_de_aula, [setPaginacao]]: any = await Promise.all([sql.query(finalQuery, valuesComPaginacao), sql.query(finalQueryPaginacao, values)]);

        return {
            data: {
                sala_de_aula: get_sala_de_aula,
                paginacao: {
                    total_itens: setPaginacao?.total_itens,
                    total_paginas: setPaginacao?.total_paginas,
                    total_itens_pagina_atual: get_sala_de_aula?.length,
                    itens_por_pagina: itensPorPagina,
                },
            },
        };
    }

    static async buscar_pelo_id(props: t.Controllers.SalaDeAula.BuscarPeloId.Input, c: t.Context): Promise<t.Controllers.SalaDeAula.BuscarPeloId.Output> {
        const sql = helpers.conn_neon.get_connection(c.env);
        const result: any = await sql`
            SELECT 
                s.*
            FROM 
                sala_de_aula s
            WHERE s._id = ${props.data._id}
            AND s.excluido IS FALSE
        `;

        return {
            data: {
                sala_de_aula: result[0],
            },
        };
    }

    static async atualizar_pelo_id(data: t.Controllers.SalaDeAula.AtualizarPeloId.Input, c: t.Context): Promise<t.Controllers.SalaDeAula.AtualizarPeloId.Output> {
        try {
            const sql = helpers.conn_neon.get_connection(c.env);
            const updates: string[] = [];
            const values: any[] = [];

            const fields = data.data.sala_de_aula;

            if (fields?.sala !== undefined) {
                updates?.push(`sala = $${updates?.length + 1}`);
                values.push(fields?.sala);
            }

            if (fields?.quantidade_de_lugares !== undefined) {
                updates?.push(`quantidade_de_lugares = $${updates?.length + 1}`);
                values.push(fields?.quantidade_de_lugares);
            }

            if (fields?.andar !== undefined) {
                updates?.push(`andar = $${updates?.length + 1}`);
                values.push(fields?.andar);
            }

            if (fields?.tipo !== undefined) {
                updates?.push(`tipo = $${updates?.length + 1}`);
                values.push(fields?.tipo);
            }

            if (fields?.disponivel !== undefined) {
                updates?.push(`disponivel = $${updates?.length + 1}`);
                values.push(fields?.disponivel);
            }

            updates?.push(`data_atualizacao = CURRENT_TIMESTAMP`);

            const setClause = updates?.join(", ");

            await sql.query(
                `
                UPDATE sala_de_aula SET ${setClause} 
                WHERE _id = $${values.length + 1}
                RETURNING *;
            `,
                [...values, data.data.sala_de_aula._id]
            );

            return await model_sala_de_aula.buscar_pelo_id({data: {_id: data.data.sala_de_aula._id}}, c);
        } catch (error) {
            return helpers.set_response.error.DATABASE_ERROR({message: "Erro ao atualizar campos na sala de aula!"}) as any;
        }
    }

    static async deletar_pelo_id(id: string, c: t.Context): Promise<t.Controllers.SalaDeAula.DeletarPeloId.Output> {
        const sql = helpers.conn_neon.get_connection(c.env);

        const result = await sql`
            UPDATE sala_de_aula 
            SET 
                excluido = TRUE,
                data_exclusao = NOW()
            WHERE _id = ${id}
            AND excluido = FALSE
            RETURNING *
        `;

        return {
            data: {
                sala_de_aula: result[0],
            },
        };
    }

    static async CREATE_TABLE_IF_NOT_EXISTS(c: t.Context) {
        const sql = helpers.conn_neon.get_connection(c.env);

        await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`;

        await sql`
            CREATE TABLE IF NOT EXISTS sala_de_aula (
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
                sala TEXT NOT NULL,
                quantidade_de_lugares INTEGER NOT NULL,
                andar INTEGER NOT NULL,
                tipo TEXT NOT NULL,
                disponivel BOOLEAN NOT NULL,
                usuario_create_id UUID NOT NULL
            )
        `;
    }
};

export default model_sala_de_aula;
