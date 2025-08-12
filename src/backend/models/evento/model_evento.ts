import t from "../../../types";
import helpers from "../../helpers/helpers";

const model_evento = class model_evento {
    static async criar(data: t.Controllers.Evento.Criar.Input, c: t.Context): Promise<t.Controllers.Evento.Criar.Output> {
        const sql = helpers.conn_neon.get_connection(c.env);
        await this.CREATE_TABLE_IF_NOT_EXISTS(c);
        const user = c.get("usuario_auth");

        try {
            const result: any = await sql`
                INSERT INTO evento (
                    _id,
                    evento,
                    data,
                    hora,
                    local,
                    responsavel,
                    aberto_ao_publico,
                    data_criacao,
                    aplicativo,
                    usuario_criacao
                ) VALUES (
                    uuid_generate_v4(),
                    ${data?.data?.evento?.evento},
                    ${data?.data?.evento?.data},
                    ${data?.data?.evento?.hora},
                    ${data?.data?.evento?.local},
                    ${data?.data?.evento?.responsavel},
                    ${data?.data?.evento?.aberto_ao_publico},
                    CURRENT_TIMESTAMP,
                    ${user.app},
                    ${user._id.toString()}
                )
                RETURNING _id, evento, data, hora, local, responsavel, aberto_ao_publico, data_criacao, data_atualizacao, usuario_criacao, usuario_atualizacao, excluido, usuario_exclusao, data_exclusao ;
            `;
            return { data: { evento: result?.[0] } };
        } catch (error) {
            return helpers.set_response.error.DATABASE_ERROR({ message: "Erro ao criar evento!" }) as any;
        }
    }

    static async buscar_pelo_filtro(filtros: t.Controllers.Evento.BuscarPeloFiltro.Input, c: t.Context): Promise<t.Controllers.Evento.BuscarPeloFiltro.Output> {
        const sql = helpers.conn_neon.get_connection(c.env);
        const conditionStrings: string[] = [];
        const values: any[] = [];
        const s_filtros = filtros?.filtros?.evento;

        const paginaAtual = s_filtros?.pagina || 1;
        const itensPorPagina = 30;
        const offset = (paginaAtual - 1) * itensPorPagina;

        if (s_filtros?._id) { conditionStrings.push("e._id = $" + (values.length + 1)); values.push(s_filtros?._id); }
        if (s_filtros?.evento) { conditionStrings.push("e.evento = $" + (values.length + 1)); values.push(s_filtros.evento); }
        if (s_filtros?.data) { conditionStrings.push("e.data = $" + (values.length + 1)); values.push(s_filtros.data); }
        if (s_filtros?.hora) { conditionStrings.push("e.hora = $" + (values.length + 1)); values.push(s_filtros.hora); }
        if (s_filtros?.local) { conditionStrings.push("e.local = $" + (values.length + 1)); values.push(s_filtros.local); }
        if (s_filtros?.responsavel) { conditionStrings.push("e.responsavel = $" + (values.length + 1)); values.push(s_filtros.responsavel); }
        if (s_filtros?.aberto_ao_publico !== undefined) { conditionStrings.push("e.aberto_ao_publico = $" + (values.length + 1)); values.push(s_filtros.aberto_ao_publico); }
        if (s_filtros?.usuario_create_id) { conditionStrings.push("e.usuario_create_id = $" + (values.length + 1)); values.push(s_filtros.usuario_create_id); }

        let finalQuery = `SELECT e.* FROM evento e`;
        let finalQueryPaginacao = `SELECT COUNT(*)::INTEGER as total_itens, CEIL(COUNT(*) / 30.0)::INTEGER as total_paginas FROM evento e`;

        if (conditionStrings.length > 0) {
            const whereClause = " WHERE " + conditionStrings.join(" AND ");
            finalQuery += whereClause;
            finalQueryPaginacao += whereClause;
        }

        finalQuery += ` LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
        const valuesComPaginacao = [...values, itensPorPagina, offset];

        const [get_evento, [setPaginacao]]: any = await Promise.all([
            sql.query(finalQuery, valuesComPaginacao),
            sql.query(finalQueryPaginacao, values)
        ]);

        return {
            data: {
                evento: get_evento,
                paginacao: {
                    total_itens: setPaginacao?.total_itens,
                    total_paginas: setPaginacao?.total_paginas,
                    total_itens_pagina_atual: get_evento?.length,
                    itens_por_pagina: itensPorPagina,
                },
            },
        };
    }

    static async buscar_pelo_id(props: t.Controllers.Evento.BuscarPeloId.Input, c: t.Context): Promise<t.Controllers.Evento.BuscarPeloId.Output> {
        const sql = helpers.conn_neon.get_connection(c.env);
        const result: any = await sql`
            SELECT e.* FROM evento e
            WHERE e._id = ${props.data._id}
            AND e.excluido IS FALSE
        `;
        return { data: { evento: result[0] } };
    }

    static async atualizar_pelo_id(data: t.Controllers.Evento.AtualizarPeloId.Input, c: t.Context): Promise<t.Controllers.Evento.AtualizarPeloId.Output> {
        try {
            const sql = helpers.conn_neon.get_connection(c.env);
            const updates: string[] = [];
            const values: any[] = [];
            const fields = data.data.evento;

            if (fields?.evento !== undefined) { updates.push(`evento = $${updates.length + 1}`); values.push(fields.evento); }
            if (fields?.data !== undefined) { updates.push(`data = $${updates.length + 1}`); values.push(fields.data); }
            if (fields?.hora !== undefined) { updates.push(`hora = $${updates.length + 1}`); values.push(fields.hora); }
            if (fields?.local !== undefined) { updates.push(`local = $${updates.length + 1}`); values.push(fields.local); }
            if (fields?.responsavel !== undefined) { updates.push(`responsavel = $${updates.length + 1}`); values.push(fields.responsavel); }
            if (fields?.aberto_ao_publico !== undefined) { updates.push(`aberto_ao_publico = $${updates.length + 1}`); values.push(fields.aberto_ao_publico); }

            updates.push(`data_atualizacao = CURRENT_TIMESTAMP`);
            const setClause = updates.join(", ");

            await sql.query(
                `UPDATE evento SET ${setClause} WHERE _id = $${values.length + 1} RETURNING *;`,
                [...values, data.data.evento._id]
            );

            return await model_evento.buscar_pelo_id({ data: { _id: data.data.evento._id } }, c);
        } catch (error) {
            return helpers.set_response.error.DATABASE_ERROR({ message: "Erro ao atualizar campos no model evento!" }) as any;
        }
    }

    static async deletar_pelo_id(id: string, c: t.Context): Promise<t.Controllers.Evento.DeletarPeloId.Output> {
        const sql = helpers.conn_neon.get_connection(c.env);
        const result = await sql`
            UPDATE evento 
            SET excluido = TRUE, data_exclusao = NOW()
            WHERE _id = ${id} AND excluido = FALSE
            RETURNING *
        `;
        return { data: { evento: result[0] } };
    }

    static async CREATE_TABLE_IF_NOT_EXISTS(c: t.Context) {
        const sql = helpers.conn_neon.get_connection(c.env);
        await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`;
        await sql`
            CREATE TABLE IF NOT EXISTS evento (
                _id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
                usuario_criacao TEXT,
                data_atualizacao TIMESTAMP WITH TIME ZONE,
                usuario_atualizacao TEXT,
                excluido BOOLEAN DEFAULT FALSE NOT NULL,
                usuario_exclusao TEXT,
                data_exclusao TIMESTAMP WITH TIME ZONE,
                aplicativo TEXT NOT NULL,
                evento TEXT NOT NULL,
                data TEXT NOT NULL,
                hora TEXT NOT NULL,
                local TEXT NOT NULL,
                responsavel TEXT NOT NULL,
                aberto_ao_publico BOOLEAN NOT NULL
            )
        `;
    }
};

export default model_evento;
