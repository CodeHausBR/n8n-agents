import t from "../../../types";

import helpers from "../../helpers/helpers";

const model_conta_pagar = class model_conta_pagar {
    static async criar(data: t.Controllers.ContaPagar.Criar.Input, c: t.Context): Promise<t.Controllers.ContaPagar.Criar.Output> {
        const sql = helpers.conn_neon.get_connection(c.env);

        await this.CREATE_TABLE_IF_NOT_EXISTS(c);

        const user = c.get("usuario_auth");

        try {
            const result: any = await sql`
                INSERT INTO conta_pagar (
                    _id,
                    checkout,
                    cliente_id,
                    parcelas,
                    valor,
                    vencimento,
                    codigo,
                    metodo_pagamento,
                    tipo_pagamento,
                    descricao,
                    referencia_externa_primaria,
                    referencia_externa_secundaria,
                    referencia_externa_terciaria,
                    referencia_externa_quartenaria,
                    documento_titular,
                    titular,
                    status,
                    status_descricao,
                    pagamento_id,
                    parcela,
                    valor_pacela,
                    metadata,
                    data_criacao,
                    aplicativo,
                    usuario_criacao
                ) VALUES (
                    uuid_generate_v4(),
                    ${data?.data?.conta_pagar?.checkout},
                    ${data?.data?.conta_pagar?.cliente_id},
                    ${data?.data?.conta_pagar?.parcelas},
                    ${data?.data?.conta_pagar?.valor},
                    ${data?.data?.conta_pagar?.vencimento},
                    ${data?.data?.conta_pagar?.codigo},
                    ${data?.data?.conta_pagar?.metodo_pagamento},
                    ${data?.data?.conta_pagar?.tipo_pagamento},
                    ${data?.data?.conta_pagar?.descricao},
                    ${data?.data?.conta_pagar?.referencia_externa_primaria},
                    ${data?.data?.conta_pagar?.referencia_externa_secundaria},
                    ${data?.data?.conta_pagar?.referencia_externa_terciaria},
                    ${data?.data?.conta_pagar?.referencia_externa_quartenaria},
                    ${data?.data?.conta_pagar?.documento_titular},
                    ${data?.data?.conta_pagar?.titular},
                    ${data?.data?.conta_pagar?.status},
                    ${data?.data?.conta_pagar?.status_descricao},
                    ${data?.data?.conta_pagar?.pagamento_id},
                    ${data?.data?.conta_pagar?.parcela},
                    ${data?.data?.conta_pagar?.valor_pacela},
                    ${JSON.stringify(data?.data?.conta_pagar?.metadata)},
                    CURRENT_TIMESTAMP,
                    ${user.app},
                    ${user._id.toString()}
                )
                RETURNING _id, checkout, cliente_id, parcelas, valor, vencimento, codigo, metodo_pagamento, tipo_pagamento, descricao, referencia_externa_primaria, referencia_externa_secundaria, referencia_externa_terciaria, referencia_externa_quartenaria, documento_titular, titular, status, status_descricao, pagamento_id, parcela, valor_pacela, metadata, data_criacao, data_atualizacao, usuario_criacao, usuario_atualizacao, excluido, usuario_exclusao, data_exclusao ;
            `;

            return {
                data: {
                    conta_pagar: result?.[0],
                },
            };
        } catch (error) {
            return helpers.set_response.error.DATABASE_ERROR({message: "Erro ao criar conta a pagar!"}) as any;
        }
    }

    static async buscar_pelo_filtro(filtros: t.Controllers.ContaPagar.BuscarPeloFiltro.Input, c: t.Context): Promise<t.Controllers.ContaPagar.BuscarPeloFiltro.Output> {
        const sql = helpers.conn_neon.get_connection(c.env);

        const conditionStrings: string[] = [];
        const values: any[] = [];

        const s_filtros = filtros?.filtros?.conta_pagar;

        const paginaAtual = s_filtros?.pagina || 1;
        const itensPorPagina = 30;
        const offset = (paginaAtual - 1) * itensPorPagina;

        if (s_filtros?._id) {
            conditionStrings.push("cp._id = $" + (values.length + 1));
            values.push(s_filtros?._id);
        }

        if (s_filtros?.checkout) {
            conditionStrings.push("cp.checkout = $" + (values.length + 1));
            values.push(s_filtros.checkout);
        }

        if (s_filtros?.cliente_id) {
            conditionStrings.push("cp.cliente_id = $" + (values.length + 1));
            values.push(s_filtros.cliente_id);
        }

        if (s_filtros?.parcelas !== undefined) {
            conditionStrings.push("cp.parcelas = $" + (values.length + 1));
            values.push(s_filtros.parcelas);
        }

        if (s_filtros?.valor !== undefined) {
            conditionStrings.push("cp.valor = $" + (values.length + 1));
            values.push(s_filtros.valor);
        }

        if (s_filtros?.vencimento) {
            conditionStrings.push("cp.vencimento = $" + (values.length + 1));
            values.push(s_filtros.vencimento);
        }

        if (s_filtros?.codigo) {
            conditionStrings.push("cp.codigo = $" + (values.length + 1));
            values.push(s_filtros.codigo);
        }

        if (s_filtros?.metodo_pagamento) {
            conditionStrings.push("cp.metodo_pagamento = $" + (values.length + 1));
            values.push(s_filtros.metodo_pagamento);
        }

        if (s_filtros?.tipo_pagamento !== undefined) {
            conditionStrings.push("cp.tipo_pagamento = $" + (values.length + 1));
            values.push(s_filtros.tipo_pagamento);
        }

        if (s_filtros?.descricao) {
            conditionStrings.push("cp.descricao = $" + (values.length + 1));
            values.push(s_filtros.descricao);
        }

        if (s_filtros?.referencia_externa_primaria) {
            conditionStrings.push("cp.referencia_externa_primaria = $" + (values.length + 1));
            values.push(s_filtros.referencia_externa_primaria);
        }

        if (s_filtros?.referencia_externa_secundaria) {
            conditionStrings.push("cp.referencia_externa_secundaria = $" + (values.length + 1));
            values.push(s_filtros.referencia_externa_secundaria);
        }

        if (s_filtros?.referencia_externa_terciaria) {
            conditionStrings.push("cp.referencia_externa_terciaria = $" + (values.length + 1));
            values.push(s_filtros.referencia_externa_terciaria);
        }

        if (s_filtros?.referencia_externa_quartenaria) {
            conditionStrings.push("cp.referencia_externa_quartenaria = $" + (values.length + 1));
            values.push(s_filtros.referencia_externa_quartenaria);
        }

        if (s_filtros?.documento_titular) {
            conditionStrings.push("cp.documento_titular = $" + (values.length + 1));
            values.push(s_filtros.documento_titular);
        }

        if (s_filtros?.titular) {
            conditionStrings.push("cp.titular = $" + (values.length + 1));
            values.push(s_filtros.titular);
        }

        if (s_filtros?.status !== undefined) {
            conditionStrings.push("cp.status = $" + (values.length + 1));
            values.push(s_filtros.status);
        }

        if (s_filtros?.status_descricao) {
            conditionStrings.push("cp.status_descricao = $" + (values.length + 1));
            values.push(s_filtros.status_descricao);
        }

        if (s_filtros?.pagamento_id) {
            conditionStrings.push("cp.pagamento_id = $" + (values.length + 1));
            values.push(s_filtros.pagamento_id);
        }

        if (s_filtros?.parcela !== undefined) {
            conditionStrings.push("cp.parcela = $" + (values.length + 1));
            values.push(s_filtros.parcela);
        }

        if (s_filtros?.valor_pacela !== undefined) {
            conditionStrings.push("cp.valor_pacela = $" + (values.length + 1));
            values.push(s_filtros.valor_pacela);
        }

        if (s_filtros?.usuario_create_id) {
            conditionStrings.push("cp.usuario_create_id = $" + (values.length + 1));
            values.push(s_filtros.usuario_create_id);
        }

        const queryString = `
            SELECT 
                cp.*
            FROM 
                conta_pagar cp
        `;

        const totalItensParaPaginacaoQuery = `
            SELECT 
                COUNT(*)::INTEGER as total_itens,
                CEIL(COUNT(*) / 30.0)::INTEGER as total_paginas
            FROM conta_pagar cp
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

        const [get_conta_pagar, [setPaginacao]]: any = await Promise.all([sql.query(finalQuery, valuesComPaginacao), sql.query(finalQueryPaginacao, values)]);

        return {
            data: {
                conta_pagar: get_conta_pagar,
                paginacao: {
                    total_itens: setPaginacao?.total_itens,
                    total_paginas: setPaginacao?.total_paginas,
                    total_itens_pagina_atual: get_conta_pagar?.length,
                    itens_por_pagina: itensPorPagina,
                },
            },
        };
    }

    static async buscar_pelo_id(props: t.Controllers.ContaPagar.BuscarPeloId.Input, c: t.Context): Promise<t.Controllers.ContaPagar.BuscarPeloId.Output> {
        const sql = helpers.conn_neon.get_connection(c.env);
        const result: any = await sql`
            SELECT 
                cp.*
            FROM 
                conta_pagar cp
            WHERE cp._id = ${props.data._id}
            AND cp.excluido IS FALSE
        `;

        return {
            data: {
                conta_pagar: result[0],
            },
        };
    }

    static async atualizar_pelo_id(data: t.Controllers.ContaPagar.AtualizarPeloId.Input, c: t.Context): Promise<t.Controllers.ContaPagar.AtualizarPeloId.Output> {
        try {
            const sql = helpers.conn_neon.get_connection(c.env);
            const updates: string[] = [];
            const values: any[] = [];

            const fields = data.data.conta_pagar;

            if (fields?.checkout !== undefined) {
                updates?.push(`checkout = $${updates?.length + 1}`);
                values.push(fields?.checkout);
            }

            if (fields?.cliente_id !== undefined) {
                updates?.push(`cliente_id = $${updates?.length + 1}`);
                values.push(fields?.cliente_id);
            }

            if (fields?.parcelas !== undefined) {
                updates?.push(`parcelas = $${updates?.length + 1}`);
                values.push(fields?.parcelas);
            }

            if (fields?.valor !== undefined) {
                updates?.push(`valor = $${updates?.length + 1}`);
                values.push(fields?.valor);
            }

            if (fields?.vencimento !== undefined) {
                updates?.push(`vencimento = $${updates?.length + 1}`);
                values.push(fields?.vencimento);
            }

            if (fields?.codigo !== undefined) {
                updates?.push(`codigo = $${updates?.length + 1}`);
                values.push(fields?.codigo);
            }

            if (fields?.metodo_pagamento !== undefined) {
                updates?.push(`metodo_pagamento = $${updates?.length + 1}`);
                values.push(fields?.metodo_pagamento);
            }

            if (fields?.tipo_pagamento !== undefined) {
                updates?.push(`tipo_pagamento = $${updates?.length + 1}`);
                values.push(fields?.tipo_pagamento);
            }

            if (fields?.descricao !== undefined) {
                updates?.push(`descricao = $${updates?.length + 1}`);
                values.push(fields?.descricao);
            }

            if (fields?.referencia_externa_primaria !== undefined) {
                updates?.push(`referencia_externa_primaria = $${updates?.length + 1}`);
                values.push(fields?.referencia_externa_primaria);
            }

            if (fields?.referencia_externa_secundaria !== undefined) {
                updates?.push(`referencia_externa_secundaria = $${updates?.length + 1}`);
                values.push(fields?.referencia_externa_secundaria);
            }

            if (fields?.referencia_externa_terciaria !== undefined) {
                updates?.push(`referencia_externa_terciaria = $${updates?.length + 1}`);
                values.push(fields?.referencia_externa_terciaria);
            }

            if (fields?.referencia_externa_quartenaria !== undefined) {
                updates?.push(`referencia_externa_quartenaria = $${updates?.length + 1}`);
                values.push(fields?.referencia_externa_quartenaria);
            }

            if (fields?.documento_titular !== undefined) {
                updates?.push(`documento_titular = $${updates?.length + 1}`);
                values.push(fields?.documento_titular);
            }

            if (fields?.titular !== undefined) {
                updates?.push(`titular = $${updates?.length + 1}`);
                values.push(fields?.titular);
            }

            if (fields?.status !== undefined) {
                updates?.push(`status = $${updates?.length + 1}`);
                values.push(fields?.status);
            }

            if (fields?.status_descricao !== undefined) {
                updates?.push(`status_descricao = $${updates?.length + 1}`);
                values.push(fields?.status_descricao);
            }

            if (fields?.pagamento_id !== undefined) {
                updates?.push(`pagamento_id = $${updates?.length + 1}`);
                values.push(fields?.pagamento_id);
            }

            if (fields?.parcela !== undefined) {
                updates?.push(`parcela = $${updates?.length + 1}`);
                values.push(fields?.parcela);
            }

            if (fields?.valor_pacela !== undefined) {
                updates?.push(`valor_pacela = $${updates?.length + 1}`);
                values.push(fields?.valor_pacela);
            }

            if (fields?.metadata !== undefined) {
                updates?.push(`metadata = $${updates?.length + 1}`);
                values.push(JSON.stringify(fields?.metadata));
            }

            updates?.push(`data_atualizacao = CURRENT_TIMESTAMP`);

            const setClause = updates?.join(", ");

            await sql.query(
                `
                UPDATE conta_pagar SET ${setClause} 
                WHERE _id = $${values.length + 1}
                RETURNING *;
            `,
                [...values, data.data.conta_pagar._id]
            );

            return await model_conta_pagar.buscar_pelo_id({data: {_id: data.data.conta_pagar._id}}, c);
        } catch (error) {
            return helpers.set_response.error.DATABASE_ERROR({message: "Erro ao atualizar campos no model conta_pagar!"}) as any;
        }
    }

    static async deletar_pelo_id(id: string, c: t.Context): Promise<t.Controllers.ContaPagar.DeletarPeloId.Output> {
        const sql = helpers.conn_neon.get_connection(c.env);

        const result = await sql`
            UPDATE conta_pagar 
            SET 
                excluido = TRUE,
                data_exclusao = NOW()
            WHERE _id = ${id}
            AND excluido = FALSE
            RETURNING *
        `;

        return {
            data: {
                conta_pagar: result[0],
            },
        };
    }

    static async CREATE_TABLE_IF_NOT_EXISTS(c: t.Context) {
        const sql = helpers.conn_neon.get_connection(c.env);

        await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`;

        await sql`
            CREATE TABLE IF NOT EXISTS conta_pagar (
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
                checkout TEXT NOT NULL,
                cliente_id TEXT NOT NULL,
                parcelas INTEGER NOT NULL,
                valor NUMERIC NOT NULL,
                vencimento TIMESTAMP WITH TIME ZONE,
                codigo TEXT NOT NULL,
                metodo_pagamento TEXT NOT NULL,
                tipo_pagamento INTEGER NOT NULL,
                descricao TEXT NOT NULL,
                referencia_externa_primaria TEXT NOT NULL,
                referencia_externa_secundaria TEXT NOT NULL,
                referencia_externa_terciaria TEXT NOT NULL,
                referencia_externa_quartenaria TEXT NOT NULL,
                documento_titular TEXT NOT NULL,
                titular TEXT NOT NULL,
                status INTEGER NOT NULL,
                status_descricao TEXT NOT NULL,
                pagamento_id TEXT NOT NULL,
                parcela INTEGER,
                valor_pacela NUMERIC NOT NULL,
                metadata JSONB
            )
        `;
    }
};

export default model_conta_pagar;
