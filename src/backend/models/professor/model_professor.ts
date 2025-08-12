import t from "../../../types";

import helpers from "../../helpers/helpers";

const model_professor = class model_professor {
    static async criar(data: t.Controllers.Professor.Criar.Input, c: t.Context): Promise<t.Controllers.Professor.Criar.Output> {
        const sql = helpers.conn_neon.get_connection(c.env);

        await this.CREATE_TABLE_IF_NOT_EXISTS(c);

        const user = c.get("usuario_auth");

        try {
            const result: any = await sql`
                INSERT INTO professor (
                    _id,
                    nome,
                    matricula,
                    disciplina,
                    email,
                    telefone,
                    sexo,
                    data_nascimento,
                    data_criacao,
                    aplicativo,
                    usuario_criacao
                ) VALUES (
                    uuid_generate_v4(),
                    ${data?.data?.professor?.nome},
                    ${data?.data?.professor?.matricula},
                    ${data?.data?.professor?.disciplina},
                    ${data?.data?.professor?.email},
                    ${data?.data?.professor?.telefone},
                    ${data?.data?.professor?.sexo},
                    ${data?.data?.professor?.dataNascimento},
                    CURRENT_TIMESTAMP,
                    ${user.app},
                    ${user._id.toString()}
                )
                RETURNING _id, nome, matricula, disciplina, email, telefone, sexo, data_nascimento, data_criacao, data_atualizacao, usuario_criacao, usuario_atualizacao, excluido, usuario_exclusao, data_exclusao ;
            `;

            return {
                data: {
                    professor: result?.[0],
                },
            };
        } catch (error) {
            return helpers.set_response.error.DATABASE_ERROR({message: "Erro ao criar professor!"}) as any;
        }
    }

    static async buscar_pelo_filtro(filtros: t.Controllers.Professor.BuscarPeloFiltro.Input, c: t.Context): Promise<t.Controllers.Professor.BuscarPeloFiltro.Output> {
        const sql = helpers.conn_neon.get_connection(c.env);

        const conditionStrings: string[] = [];
        const values: any[] = [];

        const s_filtros = filtros?.filtros?.professor;

        const paginaAtual = s_filtros?.pagina || 1;
        const itensPorPagina = 30;
        const offset = (paginaAtual - 1) * itensPorPagina;

        if (s_filtros?._id) {
            conditionStrings.push("p._id = $" + (values.length + 1));
            values.push(s_filtros?._id);
        }

        if (s_filtros?.nome) {
            conditionStrings.push("p.nome = $" + (values.length + 1));
            values.push(s_filtros.nome);
        }

        if (s_filtros?.matricula) {
            conditionStrings.push("p.matricula = $" + (values.length + 1));
            values.push(s_filtros.matricula);
        }

        if (s_filtros?.disciplina) {
            conditionStrings.push("p.disciplina = $" + (values.length + 1));
            values.push(s_filtros.disciplina);
        }

        if (s_filtros?.email) {
            conditionStrings.push("p.email = $" + (values.length + 1));
            values.push(s_filtros.email);
        }

        if (s_filtros?.telefone) {
            conditionStrings.push("p.telefone = $" + (values.length + 1));
            values.push(s_filtros.telefone);
        }

        if (s_filtros?.sexo) {
            conditionStrings.push("p.sexo = $" + (values.length + 1));
            values.push(s_filtros.sexo);
        }

        if (s_filtros?.dataNascimento) {
            conditionStrings.push("p.data_nascimento = $" + (values.length + 1));
            values.push(s_filtros.dataNascimento);
        }

        if (s_filtros?.usuario_create_id) {
            conditionStrings.push("p.usuario_create_id = $" + (values.length + 1));
            values.push(s_filtros.usuario_create_id);
        }

        const queryString = `
            SELECT 
                p.*
            FROM 
                professor p
        `;

        const totalItensParaPaginacaoQuery = `
            SELECT 
                COUNT(*)::INTEGER as total_itens,
                CEIL(COUNT(*) / 30.0)::INTEGER as total_paginas
            FROM professor p
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

        const [get_professor, [setPaginacao]]: any = await Promise.all([sql.query(finalQuery, valuesComPaginacao), sql.query(finalQueryPaginacao, values)]);

        return {
            data: {
                professor: get_professor,
                paginacao: {
                    total_itens: setPaginacao?.total_itens,
                    total_paginas: setPaginacao?.total_paginas,
                    total_itens_pagina_atual: get_professor?.length,
                    itens_por_pagina: itensPorPagina,
                },
            },
        };
    }

    static async buscar_pelo_id(props: t.Controllers.Professor.BuscarPeloId.Input, c: t.Context): Promise<t.Controllers.Professor.BuscarPeloId.Output> {
        const sql = helpers.conn_neon.get_connection(c.env);
        const result: any = await sql`
            SELECT 
                p.*
            FROM 
                professor p
            WHERE p._id = ${props.data._id}
            AND p.excluido IS FALSE
        `;

        return {
            data: {
                professor: result[0],
            },
        };
    }

    static async atualizar_pelo_id(data: t.Controllers.Professor.AtualizarPeloId.Input, c: t.Context): Promise<t.Controllers.Professor.AtualizarPeloId.Output> {
        try {
            const sql = helpers.conn_neon.get_connection(c.env);
            const updates: string[] = [];
            const values: any[] = [];

            const fields = data.data.professor;

            if (fields?.nome !== undefined) {
                updates?.push(`nome = $${updates?.length + 1}`);
                values.push(fields?.nome);
            }

            if (fields?.matricula !== undefined) {
                updates?.push(`matricula = $${updates?.length + 1}`);
                values.push(fields?.matricula);
            }

            if (fields?.disciplina !== undefined) {
                updates?.push(`disciplina = $${updates?.length + 1}`);
                values.push(fields?.disciplina);
            }

            if (fields?.email !== undefined) {
                updates?.push(`email = $${updates?.length + 1}`);
                values.push(fields?.email);
            }

            if (fields?.telefone !== undefined) {
                updates?.push(`telefone = $${updates?.length + 1}`);
                values.push(fields?.telefone);
            }

            if (fields?.sexo !== undefined) {
                updates?.push(`sexo = $${updates?.length + 1}`);
                values.push(fields?.sexo);
            }

            if (fields?.dataNascimento !== undefined) {
                updates?.push(`data_nascimento = $${updates?.length + 1}`);
                values.push(fields?.dataNascimento);
            }

            updates?.push(`data_atualizacao = CURRENT_TIMESTAMP`);

            const setClause = updates?.join(", ");

            await sql.query(
                `
                UPDATE professor SET ${setClause} 
                WHERE _id = $${values.length + 1}
                RETURNING *;
            `,
                [...values, data.data.professor._id]
            );

            return await model_professor.buscar_pelo_id({data: {_id: data.data.professor._id}}, c);
        } catch (error) {
            return helpers.set_response.error.DATABASE_ERROR({message: "Erro ao atualizar campos no model professor!"}) as any;
        }
    }

    static async deletar_pelo_id(id: string, c: t.Context): Promise<t.Controllers.Professor.DeletarPeloId.Output> {
        const sql = helpers.conn_neon.get_connection(c.env);

        const result = await sql`
            UPDATE professor 
            SET 
                excluido = TRUE,
                data_exclusao = NOW()
            WHERE _id = ${id}
            AND excluido = FALSE
            RETURNING *
        `;

        return {
            data: {
                professor: result[0],
            },
        };
    }

    static async CREATE_TABLE_IF_NOT_EXISTS(c: t.Context) {
        const sql = helpers.conn_neon.get_connection(c.env);

        await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`;

        await sql`
            CREATE TABLE IF NOT EXISTS professor (
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
                nome TEXT NOT NULL,
                matricula TEXT NOT NULL,
                disciplina TEXT NOT NULL,
                email TEXT NOT NULL,
                telefone TEXT NOT NULL,
                sexo TEXT NOT NULL,
                data_nascimento TEXT NOT NULL
            )
        `;
    }
};

export default model_professor;
