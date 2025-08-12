import t from "../../../types";

import helpers from "../../helpers/helpers";

const model_aluno = class model_aluno {
    static async criar(data: t.Controllers.Aluno.Criar.Input, c: t.Context): Promise<t.Controllers.Aluno.Criar.Output> {
        const sql = helpers.conn_neon.get_connection(c.env);

        await this.CREATE_TABLE_IF_NOT_EXISTS(c);

        const user = c.get("usuario_auth");

        try {
            const result: any = await sql`
                INSERT INTO aluno (
                    _id,
                    nome,
                    matricula,
                    serie,
                    turma,
                    data_nascimento,
                    sexo,
                    data_criacao,
                    aplicativo,
                    usuario_criacao
                ) VALUES (
                    uuid_generate_v4(),
                    ${data?.data?.aluno?.nome},
                    ${data?.data?.aluno?.matricula},
                    ${data?.data?.aluno?.serie},
                    ${data?.data?.aluno?.turma},
                    ${data?.data?.aluno?.dataNascimento},
                    ${data?.data?.aluno?.sexo},
                    CURRENT_TIMESTAMP,
                    ${user.app},
                    ${user._id.toString()}
                )
                RETURNING _id, nome, matricula, serie, turma, data_nascimento, sexo, data_criacao, data_atualizacao, usuario_criacao, usuario_atualizacao, excluido, usuario_exclusao, data_exclusao;
            `;

            return {
                data: {
                    aluno: result?.[0],
                },
            };
        } catch (error) {
            return helpers.set_response.error.DATABASE_ERROR({message: "Erro ao criar aluno!"}) as any;
        }
    }

    static async buscar_pelo_filtro(filtros: t.Controllers.Aluno.BuscarPeloFiltro.Input, c: t.Context): Promise<t.Controllers.Aluno.BuscarPeloFiltro.Output> {
        const sql = helpers.conn_neon.get_connection(c.env);

        const conditionStrings: string[] = [];
        const values: any[] = [];

        const s_filtros = filtros?.filtros?.aluno;

        const paginaAtual = s_filtros?.pagina || 1;
        const itensPorPagina = 30;
        const offset = (paginaAtual - 1) * itensPorPagina;

        if (s_filtros?._id) {
            conditionStrings.push("a._id = $" + (values.length + 1));
            values.push(s_filtros._id);
        }

        if (s_filtros?.nome) {
            conditionStrings.push("a.nome = $" + (values.length + 1));
            values.push(s_filtros.nome);
        }

        if (s_filtros?.matricula) {
            conditionStrings.push("a.matricula = $" + (values.length + 1));
            values.push(s_filtros.matricula);
        }

        if (s_filtros?.serie) {
            conditionStrings.push("a.serie = $" + (values.length + 1));
            values.push(s_filtros.serie);
        }

        if (s_filtros?.turma) {
            conditionStrings.push("a.turma = $" + (values.length + 1));
            values.push(s_filtros.turma);
        }

        if (s_filtros?.dataNascimento) {
            conditionStrings.push("a.data_nascimento = $" + (values.length + 1));
            values.push(s_filtros.dataNascimento);
        }

        if (s_filtros?.sexo) {
            conditionStrings.push("a.sexo = $" + (values.length + 1));
            values.push(s_filtros.sexo);
        }

        if (s_filtros?.usuario_create_id) {
            conditionStrings.push("a.usuario_criacao = $" + (values.length + 1));
            values.push(s_filtros.usuario_create_id);
        }

        const queryString = `
            SELECT 
                a.*
            FROM 
                aluno a
        `;

        const totalItensParaPaginacaoQuery = `
            SELECT 
                COUNT(*)::INTEGER as total_itens,
                CEIL(COUNT(*) / 30.0)::INTEGER as total_paginas
            FROM aluno a
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

        const [get_aluno, [setPaginacao]]: any = await Promise.all([sql.query(finalQuery, valuesComPaginacao), sql.query(finalQueryPaginacao, values)]);

        return {
            data: {
                aluno: get_aluno,
                paginacao: {
                    total_itens: setPaginacao?.total_itens,
                    total_paginas: setPaginacao?.total_paginas,
                    total_itens_pagina_atual: get_aluno?.length,
                    itens_por_pagina: itensPorPagina,
                },
            },
        };
    }

    static async buscar_pelo_id(props: t.Controllers.Aluno.BuscarPeloId.Input, c: t.Context): Promise<t.Controllers.Aluno.BuscarPeloId.Output> {
        const sql = helpers.conn_neon.get_connection(c.env);
        const result: any = await sql`
            SELECT 
                a.*
            FROM 
                aluno a
            WHERE a._id = ${props.data._id}
            AND a.excluido IS FALSE
        `;

        return {
            data: {
                aluno: result[0],
            },
        };
    }

    static async atualizar_pelo_id(data: t.Controllers.Aluno.AtualizarPeloId.Input, c: t.Context): Promise<t.Controllers.Aluno.AtualizarPeloId.Output> {
        try {
            const sql = helpers.conn_neon.get_connection(c.env);
            const updates: string[] = [];
            const values: any[] = [];

            const fields = data.data.aluno;

            if (fields?.nome !== undefined) {
                updates.push(`nome = $${updates.length + 1}`);
                values.push(fields.nome);
            }

            if (fields?.matricula !== undefined) {
                updates.push(`matricula = $${updates.length + 1}`);
                values.push(fields.matricula);
            }

            if (fields?.serie !== undefined) {
                updates.push(`serie = $${updates.length + 1}`);
                values.push(fields.serie);
            }

            if (fields?.turma !== undefined) {
                updates.push(`turma = $${updates.length + 1}`);
                values.push(fields.turma);
            }

            if (fields?.dataNascimento !== undefined) {
                updates.push(`data_nascimento = $${updates.length + 1}`);
                values.push(fields.dataNascimento);
            }

            if (fields?.sexo !== undefined) {
                updates.push(`sexo = $${updates.length + 1}`);
                values.push(fields.sexo);
            }

            updates.push(`data_atualizacao = CURRENT_TIMESTAMP`);

            const setClause = updates.join(", ");

            await sql.query(
                `
                UPDATE aluno SET ${setClause} 
                WHERE _id = $${values.length + 1}
                RETURNING *;
            `,
                [...values, data.data.aluno._id]
            );

            return await model_aluno.buscar_pelo_id({data: {_id: data.data.aluno._id}}, c);
        } catch (error) {
            return helpers.set_response.error.DATABASE_ERROR({message: "Erro ao atualizar campos no model aluno!"}) as any;
        }
    }

    static async deletar_pelo_id(id: string, c: t.Context): Promise<t.Controllers.Aluno.DeletarPeloId.Output> {
        const sql = helpers.conn_neon.get_connection(c.env);

        const result = await sql`
            UPDATE aluno 
            SET 
                excluido = TRUE,
                data_exclusao = NOW()
            WHERE _id = ${id}
            AND excluido = FALSE
            RETURNING *
        `;

        return {
            data: {
                aluno: result[0],
            },
        };
    }

    static async CREATE_TABLE_IF_NOT_EXISTS(c: t.Context) {
        const sql = helpers.conn_neon.get_connection(c.env);

        await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`;

        await sql`
            CREATE TABLE IF NOT EXISTS aluno (
                _id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
                usuario_criacao TEXT,
                data_atualizacao TIMESTAMP WITH TIME ZONE,
                usuario_atualizacao TEXT,
                excluido BOOLEAN DEFAULT FALSE NOT NULL,
                usuario_exclusao TEXT,
                data_exclusao TIMESTAMP WITH TIME ZONE,
                aplicativo TEXT NOT NULL,
                nome TEXT NOT NULL,
                matricula TEXT NOT NULL,
                serie TEXT NOT NULL,
                turma TEXT NOT NULL,
                data_nascimento TEXT NOT NULL,
                sexo TEXT NOT NULL
            )
        `;
    }
};

export default model_aluno;
