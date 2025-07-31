import t from "../../../types";

import helpers from "../../helpers/helpers";

const model_cliente = class model_cliente {
    static async criar(data: t.Controllers.Cliente.Criar.Input, c: t.Context): Promise<t.Controllers.Cliente.Criar.Output> {
        const sql = helpers.conn_neon.get_connection(c.env);

        await this.CREATE_TABLE_IF_NOT_EXISTS(c);

        const cliente_auth = c.get("usuario_auth");

        const customerType: string = data?.data?.cliente?.cpf_cnpj?.length > 11 ? "corporativo" : "individual";

        try {
            const result: any = await sql`
                INSERT INTO cliente (
                    _id,
                    aplicativo,
                    usuario_criacao,
                    nome,
                    email,
                    referencia_externa,
                    cpf_cnpj,
                    tipo,
                    genero,
                    data_nascimento,
                    endereco,
                    complemento,
                    cep,
                    cidade,
                    estado,
                    pais,
                    telefone,
                    celular,
                    data_criacao
                ) VALUES (
                    uuid_generate_v4(),
                    ${cliente_auth.app},
                    ${cliente_auth._id},
                    ${data?.data?.cliente?.nome},
                    ${data?.data?.cliente?.email},
                    ${data?.data?.cliente?.referencia_externa},
                    ${data?.data?.cliente?.cpf_cnpj},
                    ${customerType},
                    ${data?.data?.cliente?.genero},
                    ${data?.data?.cliente?.data_nascimento},
                    ${data?.data?.cliente?.endereco},
                    ${data?.data?.cliente?.complemento},
                    ${data?.data?.cliente?.cep},
                    ${data?.data?.cliente?.cidade},
                    ${data?.data?.cliente?.estado},
                    ${data?.data?.cliente?.pais},
                    ${data?.data?.cliente?.telefone},
                    ${data?.data?.cliente?.celular},
                    CURRENT_TIMESTAMP
                )
                RETURNING _id, nome, email, referencia_externa, cpf_cnpj, tipo, genero, data_nascimento, endereco, complemento, cep, cidade, estado, pais, telefone, celular, excluido, data_criacao, data_atualizacao, usuario_criacao, usuario_atualizacao, usuario_exclusao, data_exclusao;
            `;

            return {
                data: {
                    cliente: result?.[0],
                },
            };
        } catch (error) {
            console.log(error);

            return helpers.set_response.error.DATABASE_ERROR({message: "Erro ao criar cliente!"}) as any;
        }
    }

    static async buscar_pelo_filtro(filtros: t.Controllers.Cliente.BuscarPeloFiltro.Input, c: t.Context): Promise<t.Controllers.Cliente.BuscarPeloFiltro.Output> {
        const sql = helpers.conn_neon.get_connection(c.env);

        const conditionStrings: string[] = [];
        const values: any[] = [];

        const s_filtros = filtros?.filtros?.cliente;

        const paginaAtual = s_filtros?.pagina || 1;
        const itensPorPagina = 30;
        const offset = (paginaAtual - 1) * itensPorPagina;

        if (s_filtros?._id) {
            conditionStrings.push("c._id = $" + (values.length + 1));
            values.push(s_filtros?._id);
        }

        if (s_filtros?.nome) {
            conditionStrings.push("c.nome ILIKE $" + (values.length + 1));
            values.push(`%${s_filtros.nome}%`);
        }

        if (s_filtros?.email) {
            conditionStrings.push("c.email = $" + (values.length + 1));
            values.push(s_filtros.email);
        }

        if (s_filtros?.referencia_externa) {
            conditionStrings.push("c.referencia_externa = $" + (values.length + 1));
            values.push(s_filtros.referencia_externa);
        }

        if (s_filtros?.cpf_cnpj) {
            conditionStrings.push("c.cpf_cnpj = $" + (values.length + 1));
            values.push(s_filtros.cpf_cnpj);
        }

        if (s_filtros?.tipo) {
            conditionStrings.push("c.tipo = $" + (values.length + 1));
            values.push(s_filtros.tipo);
        }

        if (s_filtros?.genero) {
            conditionStrings.push("c.genero = $" + (values.length + 1));
            values.push(s_filtros.genero);
        }

        if (s_filtros?.data_nascimento) {
            conditionStrings.push("c.data_nascimento = $" + (values.length + 1));
            values.push(s_filtros.data_nascimento);
        }

        if (s_filtros?.endereco) {
            conditionStrings.push("c.endereco = $" + (values.length + 1));
            values.push(s_filtros.endereco);
        }

        if (s_filtros?.complemento) {
            conditionStrings.push("c.complemento = $" + (values.length + 1));
            values.push(s_filtros.complemento);
        }

        if (s_filtros?.cep) {
            conditionStrings.push("c.cep = $" + (values.length + 1));
            values.push(s_filtros.cep);
        }

        if (s_filtros?.cidade) {
            conditionStrings.push("c.cidade = $" + (values.length + 1));
            values.push(s_filtros.cidade);
        }

        if (s_filtros?.estado) {
            conditionStrings.push("c.estado = $" + (values.length + 1));
            values.push(s_filtros.estado);
        }

        if (s_filtros?.pais) {
            conditionStrings.push("c.pais = $" + (values.length + 1));
            values.push(s_filtros.pais);
        }

        if (s_filtros?.telefone) {
            conditionStrings.push("c.telefone = $" + (values.length + 1));
            values.push(s_filtros.telefone);
        }

        if (s_filtros?.celular) {
            conditionStrings.push("c.celular = $" + (values.length + 1));
            values.push(s_filtros.celular);
        }

        if (s_filtros?.excluido !== undefined) {
            conditionStrings.push("c.excluido = $" + (values.length + 1));
            values.push(s_filtros.excluido);
        }

        if (s_filtros?.usuario_criacao) {
            conditionStrings.push("c.usuario_criacao = $" + (values.length + 1));
            values.push(s_filtros.usuario_criacao);
        }

        const queryString = `
            SELECT 
                c.*
            FROM 
                cliente c
        `;

        const totalItensParaPaginacaoQuery = `
            SELECT 
                COUNT(*)::INTEGER as total_itens,
                CEIL(COUNT(*) / 30.0)::INTEGER as total_paginas
            FROM cliente c
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

        const [get_cliente, [setPaginacao]]: any = await Promise.all([sql.query(finalQuery, valuesComPaginacao), sql.query(finalQueryPaginacao, values)]);

        return {
            data: {
                cliente: get_cliente,
                paginacao: {
                    total_itens: setPaginacao?.total_itens,
                    total_paginas: setPaginacao?.total_paginas,
                    total_itens_pagina_atual: get_cliente?.length,
                    itens_por_pagina: itensPorPagina,
                },
            },
        };
    }

    static async buscar_pelo_id(props: t.Controllers.Cliente.BuscarPeloId.Input, c: t.Context): Promise<t.Controllers.Cliente.BuscarPeloId.Output> {
        const sql = helpers.conn_neon.get_connection(c.env);
        const result: any = await sql`
            SELECT 
                c.*
            FROM 
                cliente c
            WHERE c._id = ${props.data._id}
            AND c.excluido IS FALSE
        `;

        return {
            data: {
                cliente: result[0],
            },
        };
    }

    static async atualizar_pelo_id(data: t.Controllers.Cliente.AtualizarPeloId.Input, c: t.Context): Promise<t.Controllers.Cliente.BuscarPeloId.Output> {
        try {
            const sql = helpers.conn_neon.get_connection(c.env);
            const updates: string[] = [];
            const values: any = [];

            const cliente_auth = c.get("usuario_auth");

            const fields = data.data.cliente;

            if (fields?.asaas_external_id !== undefined) {
                updates?.push(`asaas_external_id = $${updates?.length + 1}`);
                values.push(fields?.asaas_external_id);
            }
            if (fields?.pagarme_external_id !== undefined) {
                updates?.push(`pagarme_external_id = $${updates?.length + 1}`);
                values.push(fields?.pagarme_external_id);
            }

            if (fields?.nome !== undefined) {
                updates?.push(`nome = $${updates?.length + 1}`);
                values.push(fields?.nome);
            }

            if (fields?.email !== undefined) {
                updates?.push(`email = $${updates?.length + 1}`);
                values.push(fields?.email);
            }

            if (fields?.referencia_externa !== undefined) {
                updates?.push(`referencia_externa = $${updates?.length + 1}`);
                values.push(fields?.referencia_externa);
            }

            if (fields?.cpf_cnpj !== undefined) {
                updates?.push(`cpf_cnpj = $${updates?.length + 1}`);
                values.push(fields?.cpf_cnpj);
            }

            if (fields?.tipo !== undefined) {
                updates?.push(`tipo = $${updates?.length + 1}`);
                values.push(fields?.tipo);
            }

            if (fields?.genero !== undefined) {
                updates?.push(`genero = $${updates?.length + 1}`);
                values.push(fields?.genero);
            }

            if (fields?.data_nascimento !== undefined) {
                updates?.push(`data_nascimento = $${updates?.length + 1}`);
                values.push(fields?.data_nascimento);
            }

            if (fields?.endereco !== undefined) {
                updates?.push(`endereco = $${updates?.length + 1}`);
                values.push(fields?.endereco);
            }

            if (fields?.complemento !== undefined) {
                updates?.push(`complemento = $${updates?.length + 1}`);
                values.push(fields?.complemento);
            }

            if (fields?.cep !== undefined) {
                updates?.push(`cep = $${updates?.length + 1}`);
                values.push(fields?.cep);
            }

            if (fields?.cidade !== undefined) {
                updates?.push(`cidade = $${updates?.length + 1}`);
                values.push(fields?.cidade);
            }

            if (fields?.estado !== undefined) {
                updates?.push(`estado = $${updates?.length + 1}`);
                values.push(fields?.estado);
            }

            if (fields?.pais !== undefined) {
                updates?.push(`pais = $${updates?.length + 1}`);
                values.push(fields?.pais);
            }

            if (fields?.telefone !== undefined) {
                updates?.push(`telefone = $${updates?.length + 1}`);
                values.push(fields?.telefone);
            }

            if (fields?.celular !== undefined) {
                updates?.push(`celular = $${updates?.length + 1}`);
                values.push(fields?.celular);
            }

            if (fields?.excluido !== undefined) {
                updates?.push(`excluido = $${updates?.length + 1}`);
                values.push(fields?.excluido);
            }

            updates?.push(`data_atualizacao = CURRENT_TIMESTAMP`);

            updates?.push(`usuario_atualizacao = ${cliente_auth._id}`);

            const setClause = updates?.join(", ");

            await sql.query(
                `
                UPDATE cliente SET ${setClause} 
                WHERE _id = $${values.length + 1}
                RETURNING *;
            `,
                [...values, data.data.cliente._id]
            );

            return await model_cliente.buscar_pelo_id({data: {_id: data.data.cliente._id}}, c);
        } catch (error) {
            return helpers.set_response.error.DATABASE_ERROR({message: "Erro ao atualizar campos no model cliente!"}) as any;
        }
    }

    static async deletar_pelo_id(id: string, c: t.Context): Promise<t.Controllers.Cliente.DeletarPeloId.Output> {
        const sql = helpers.conn_neon.get_connection(c.env);

        const cliente_auth = c.get("usuario_auth");

        const result = await sql`
            UPDATE cliente 
            SET 
                excluido = TRUE,
                data_exclusao = NOW(),
                usuario_exclusao = ${cliente_auth._id}
            WHERE _id = ${id}
            AND excluido = FALSE
            RETURNING *
        `;

        return {
            data: {
                cliente: result[0],
            },
        };
    }

    static async CREATE_TABLE_IF_NOT_EXISTS(c: t.Context) {
        const sql = helpers.conn_neon.get_connection(c.env);

        await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`;

        await sql`
            CREATE TABLE IF NOT EXISTS cliente (
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
                pagarme_external_id TEXT UNIQUE,
                asaas_external_id TEXT UNIQUE,
                nome TEXT NOT NULL,
                email TEXT NOT NULL,
                referencia_externa TEXT NOT NULL UNIQUE,
                cpf_cnpj TEXT NOT NULL,
                tipo TEXT NOT NULL,
                genero TEXT,
                data_nascimento TEXT,
                endereco TEXT,
                complemento TEXT,
                cep TEXT,
                cidade TEXT,
                estado TEXT,
                pais TEXT,
                telefone TEXT,
                celular TEXT NOT NULL
            )
        `;
    }
};

export default model_cliente;
