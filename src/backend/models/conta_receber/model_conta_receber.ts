import t from "../../../types";
import helpers from "../../helpers/helpers";
//UTILS

const model_conta_receber = class model_conta_receber {
    static async criar(
        data: Array<t.Controllers.ContaReceber.Criar.Input>,
        cliente: t.Controllers.Cliente.BuscarPeloId.Output,
        c: t.Context
    ): Promise<t.Controllers.ContaReceber.Criar.Output> {
        const sql = helpers.conn_neon.get_connection(c.env);

        const usuario = c.get("usuario_auth");

        await this.CREATE_TABLE_IF_NOT_EXISTS(c);

        const valores: any[] = [];
        const placeholders: string[] = [];

        data.forEach((registro, index) => {
            const conta = registro.data.conta_receber;

            const baseIndex = index * 23;

            const placeholder = `(
                $${baseIndex + 1},
                $${baseIndex + 2},
                $${baseIndex + 3},
                $${baseIndex + 4},
                $${baseIndex + 5},
                $${baseIndex + 6},
                $${baseIndex + 7},
                $${baseIndex + 8},
                $${baseIndex + 9},
                $${baseIndex + 10},
                $${baseIndex + 11},
                $${baseIndex + 12},
                $${baseIndex + 13},
                $${baseIndex + 14},
                $${baseIndex + 15},
                $${baseIndex + 16},
                $${baseIndex + 17},
                $${baseIndex + 18},
                $${baseIndex + 19},
                $${baseIndex + 20},
                $${baseIndex + 21},
                $${baseIndex + 22},
                $${baseIndex + 23}
                )`;

            placeholders.push(placeholder);

            valores.push(
                conta?.checkout,
                cliente?.data?.cliente?._id,
                conta?.parcelas,
                conta?.valor,
                conta?.vencimento,
                conta?.codigo,
                conta?.metodo_pagamento,
                conta?.tipo_pagamento,
                conta?.descricao ?? "",
                conta?.referencia_externa_primaria,
                conta?.referencia_externa_secundaria,
                conta?.referencia_externa_terciaria,
                conta?.referencia_externa_quartenaria,
                conta?.metadata ?? {},
                conta?.status,
                conta?.pagamento_id,
                conta?.parcela,
                conta?.valor_pacela,
                conta?.url_pedido,
                conta?.url_cobranca,
                new Date(),
                usuario?._id,
                usuario?.app
            );
        });

        const query = `
            INSERT INTO conta_receber (
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
                metadata,
                status,
                pagamento_id,
                parcela,
                valor_pacela,
                url_pedido,
                url_cobranca,
                data_criacao,
                usuario_criacao,
                aplicativo
                ) VALUES
                ${placeholders.join(", ")}
                RETURNING *;
                `;

        try {
            const result = await sql.query(query, valores);

            return {
                data: {
                    conta_receber: result?.[0] as t.Controllers.ContaReceber.Criar.Output["data"]["conta_receber"],
                },
            };
        } catch (error) {
            return helpers.set_response.error.DATABASE_ERROR({message: "Erro ao criar conta_receber!"}) as any;
        }
    }

    static async buscar_pelo_filtro(filtros: t.Controllers.ContaReceber.BuscarPeloFiltro.Input, c: t.Context): Promise<t.Controllers.ContaReceber.BuscarPeloFiltro.Output> {
        const sql = helpers.conn_neon.get_connection(c.env);

        const conditionStrings: string[] = [];
        const values: any[] = [];

        const s_filtros = filtros?.filtros?.conta_receber;

        const paginaAtual = s_filtros?.pagina || 1;
        const itensPorPagina = 10;
        const offset = (paginaAtual - 1) * itensPorPagina;

        if (s_filtros?._id) {
            conditionStrings.push("cr._id = $" + (values.length + 1));
            values.push(s_filtros?._id);
        }

        if (s_filtros?.checkout) {
            conditionStrings.push("cr.checkout = $" + (values.length + 1));
            values.push(s_filtros.checkout);
        }

        if (s_filtros?.cliente_id) {
            conditionStrings.push("cr.cliente_id = $" + (values.length + 1));
            values.push(s_filtros.cliente_id);
        }

        if (s_filtros?.parcelas) {
            conditionStrings.push("cr.parcelas = $" + (values.length + 1));
            values.push(s_filtros.parcelas);
        }

        if (s_filtros?.valor) {
            conditionStrings.push("cr.valor = $" + (values.length + 1));
            values.push(s_filtros.valor);
        }

        if (s_filtros?.vencimento) {
            conditionStrings.push("cr.vencimento = $" + (values.length + 1));
            values.push(s_filtros.vencimento);
        }

        if (s_filtros?.codigo) {
            conditionStrings.push("cr.codigo = $" + (values.length + 1));
            values.push(s_filtros.codigo);
        }

        if (s_filtros?.metodo_pagamento) {
            conditionStrings.push("cr.metodo_pagamento = $" + (values.length + 1));
            values.push(s_filtros.metodo_pagamento);
        }

        if (s_filtros?.tipo_pagamento) {
            conditionStrings.push("cr.tipo_pagamento = $" + (values.length + 1));
            values.push(s_filtros.tipo_pagamento);
        }

        if (s_filtros?.descricao) {
            conditionStrings.push("cr.descricao = $" + (values.length + 1));
            values.push(s_filtros.descricao);
        }

        if (s_filtros?.referencia_externa_primaria) {
            conditionStrings.push("cr.referencia_externa_primaria = $" + (values.length + 1));
            values.push(s_filtros.referencia_externa_primaria);
        }

        if (s_filtros?.referencia_externa_secundaria) {
            conditionStrings.push("cr.referencia_externa_secundaria = $" + (values.length + 1));
            values.push(s_filtros.referencia_externa_secundaria);
        }

        if (s_filtros?.referencia_externa_terciaria) {
            conditionStrings.push("cr.referencia_externa_terciaria = $" + (values.length + 1));
            values.push(s_filtros.referencia_externa_terciaria);
        }

        if (s_filtros?.referencia_externa_quartenaria) {
            conditionStrings.push("cr.referencia_externa_quartenaria = $" + (values.length + 1));
            values.push(s_filtros.referencia_externa_quartenaria);
        }

        if (s_filtros?.ativo) {
            conditionStrings.push("cr.ativo = $" + (values.length + 1));
            values.push(s_filtros.ativo);
        }

        if (s_filtros?.documento_titular) {
            conditionStrings.push("cr.documento_titular = $" + (values.length + 1));
            values.push(s_filtros.documento_titular);
        }

        if (s_filtros?.titular) {
            conditionStrings.push("cr.titular = $" + (values.length + 1));
            values.push(s_filtros.titular);
        }

        if (s_filtros?.status) {
            conditionStrings.push("cr.status = $" + (values.length + 1));
            values.push(s_filtros.status);
        }

        if (s_filtros?.numero_cartao) {
            conditionStrings.push("cr.numero_cartao = $" + (values.length + 1));
            values.push(s_filtros.numero_cartao);
        }

        if (s_filtros?.numero_serial) {
            conditionStrings.push("cr.numero_serial = $" + (values.length + 1));
            values.push(s_filtros.numero_serial);
        }

        if (s_filtros?.pagamento_id) {
            conditionStrings.push("cr.pagamento_id = $" + (values.length + 1));
            values.push(s_filtros.pagamento_id);
        }

        if (s_filtros?.parcela) {
            conditionStrings.push("cr.parcela = $" + (values.length + 1));
            values.push(s_filtros.parcela);
        }

        if (s_filtros?.valor_pacela) {
            conditionStrings.push("cr.valor_pacela = $" + (values.length + 1));
            values.push(s_filtros.valor_pacela);
        }

        if (s_filtros?.url_pedido) {
            conditionStrings.push("cr.url_pedido = $" + (values.length + 1));
            values.push(s_filtros.url_pedido);
        }

        if (s_filtros?.url_cobranca) {
            conditionStrings.push("cr.url_cobranca = $" + (values.length + 1));
            values.push(s_filtros.url_cobranca);
        }

        if (s_filtros?.usuario_create_id) {
            conditionStrings.push("cr.usuario_create_id = $" + (values.length + 1));
            values.push(s_filtros.usuario_create_id);
        }

        conditionStrings.push("cr.excluido = $" + (values.length + 1));
        values.push(s_filtros.excluido);

        const queryString = `
            SELECT 
                cr._id,
                cr.data_criacao,
                cr.usuario_criacao,
                cr.data_atualizacao,
                cr.usuario_atualizacao,
                cr.excluido,
                cr.usuario_exclusao,
                cr.data_exclusao,
                cr.aplicativo,
                cr.checkout,
                -- cr.cliente_id,
                cr.parcelas,
                cr.valor,
                cr.vencimento,
                cr.codigo,
                cr.metodo_pagamento,
                cr.tipo_pagamento,
                cr.descricao,
                cr.referencia_externa_primaria,
                cr.referencia_externa_secundaria,
                cr.referencia_externa_terciaria,
                cr.referencia_externa_quartenaria,
                cr.ativo,
                cr.documento_titular,
                cr.titular,
                cr.status,
                cr.numero_cartao,
                cr.numero_serial,
                cr.pagamento_id,
                cr.parcela,
                cr.valor_pacela / 100 valor_parcela,
                cr.url_pedido,
                cr.url_cobranca,
                cr.metadata,
                h.descricao as status_descricao,
                json_build_object(
                    '_id', c._id,
                    'nome', c.nome,
                    'email', c.email,
                    'telefone', c.telefone,
                    'celular', c.celular
                ) as cliente
            FROM 
                conta_receber cr
            LEFT JOIN helpers h ON cr.status = h._id
            LEFT JOIN cliente c ON cr.cliente_id = c._id
        `;

        const totalItensParaPaginacaoQuery = `
            SELECT 
                COUNT(*)::INTEGER as total_itens,
                CEIL(COUNT(*) / 10.0)::INTEGER as total_paginas
            FROM conta_receber cr
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
        const [get_conta_receber, [setPaginacao]]: any = await Promise.all([sql.query(finalQuery, valuesComPaginacao), sql.query(finalQueryPaginacao, values)]);

        return {
            data: {
                conta_receber: get_conta_receber,
                paginacao: {
                    total_itens: setPaginacao?.total_itens,
                    total_paginas: setPaginacao?.total_paginas,
                    total_itens_pagina_atual: get_conta_receber?.length,
                    itens_por_pagina: itensPorPagina,
                },
            },
        };
    }

    static async buscar_pelo_id(props: t.Controllers.ContaReceber.BuscarPeloId.Input, c: t.Context): Promise<t.Controllers.ContaReceber.BuscarPeloId.Output> {
        const sql = helpers.conn_neon.get_connection(c.env);
        const result: any = await sql`
            SELECT 
                cr._id,
                cr.data_criacao,
                cr.usuario_criacao,
                cr.data_atualizacao,
                cr.usuario_atualizacao,
                cr.excluido,
                cr.usuario_exclusao,
                cr.data_exclusao,
                cr.aplicativo,
                cr.checkout,
                -- cr.cliente_id,
                cr.parcelas,
                cr.valor,
                cr.vencimento,
                cr.codigo,
                cr.metodo_pagamento,
                cr.tipo_pagamento,
                cr.descricao,
                cr.referencia_externa_primaria,
                cr.referencia_externa_secundaria,
                cr.referencia_externa_terciaria,
                cr.referencia_externa_quartenaria,
                cr.ativo,
                cr.documento_titular,
                cr.titular,
                cr.status,
                cr.numero_cartao,
                cr.numero_serial,
                cr.pagamento_id,
                cr.parcela,
                cr.valor_pacela / 100 as valor_parcela,
                cr.url_pedido,
                cr.url_cobranca,
                cr.metadata,
                h.descricao AS status_descricao,
                json_build_object(
                        'nome', c.nome,
                        'email', c.email,
                        'telefone', c.telefone,
                        'celular', c.celular
                )as cliente
            FROM 
                conta_receber cr
            LEFT JOIN helpers h ON cr.status = h._id
            LEFT JOIN cliente c ON cr.cliente_id = c._id
            WHERE cr._id = ${props.data._id}
            AND cr.excluido IS FALSE
        `;

        return {
            data: {
                conta_receber: result[0],
            },
        };
    }

    static async atualizar_pelo_id(data: t.Controllers.ContaReceber.AtualizarPeloId.Input, c: t.Context): Promise<t.Controllers.ContaReceber.AtualizarPeloId.Output> {
        try {
            const sql = helpers.conn_neon.get_connection(c.env);
            const updates: string[] = [];
            const values: any[] = [];

            const fields = data.data.conta_receber;

            if (fields?.checkout) {
                updates?.push(`checkout = $${updates?.length + 1}`);
                values.push(fields?.checkout);
            }

            if (fields?.cliente_id) {
                updates?.push(`cliente_id = $${updates?.length + 1}`);
                values.push(fields?.cliente_id);
            }

            if (fields?.parcelas) {
                updates?.push(`parcelas = $${updates?.length + 1}`);
                values.push(fields?.parcelas);
            }

            if (fields?.valor) {
                updates?.push(`valor = $${updates?.length + 1}`);
                values.push(fields?.valor);
            }

            if (fields?.vencimento) {
                updates?.push(`vencimento = $${updates?.length + 1}`);
                values.push(fields?.vencimento);
            }

            if (fields?.codigo) {
                updates?.push(`codigo = $${updates?.length + 1}`);
                values.push(fields?.codigo);
            }

            if (fields?.metodo_pagamento) {
                updates?.push(`metodo_pagamento = $${updates?.length + 1}`);
                values.push(fields?.metodo_pagamento);
            }

            if (fields?.tipo_pagamento) {
                updates?.push(`tipo_pagamento = $${updates?.length + 1}`);
                values.push(fields?.tipo_pagamento);
            }

            if (fields?.descricao) {
                updates?.push(`descricao = $${updates?.length + 1}`);
                values.push(fields?.descricao);
            }

            if (fields?.referencia_externa_primaria) {
                updates?.push(`referencia_externa_primaria = $${updates?.length + 1}`);
                values.push(fields?.referencia_externa_primaria);
            }

            if (fields?.referencia_externa_secundaria) {
                updates?.push(`referencia_externa_secundaria = $${updates?.length + 1}`);
                values.push(fields?.referencia_externa_secundaria);
            }

            if (fields?.referencia_externa_terciaria) {
                updates?.push(`referencia_externa_terciaria = $${updates?.length + 1}`);
                values.push(fields?.referencia_externa_terciaria);
            }

            if (fields?.referencia_externa_quartenaria) {
                updates?.push(`referencia_externa_quartenaria = $${updates?.length + 1}`);
                values.push(fields?.referencia_externa_quartenaria);
            }

            if (fields?.ativo) {
                updates?.push(`ativo = $${updates?.length + 1}`);
                values.push(fields?.ativo);
            }

            if (fields?.documento_titular) {
                updates?.push(`documento_titular = $${updates?.length + 1}`);
                values.push(fields?.documento_titular);
            }

            if (fields?.titular) {
                updates?.push(`titular = $${updates?.length + 1}`);
                values.push(fields?.titular);
            }

            if (fields?.status) {
                updates?.push(`status = $${updates?.length + 1}`);
                values.push(fields?.status);
            }

            if (fields?.numero_cartao) {
                updates?.push(`numero_cartao = $${updates?.length + 1}`);
                values.push(fields?.numero_cartao);
            }

            if (fields?.numero_serial) {
                updates?.push(`numero_serial = $${updates?.length + 1}`);
                values.push(fields?.numero_serial);
            }

            if (fields?.pagamento_id) {
                updates?.push(`pagamento_id = $${updates?.length + 1}`);
                values.push(fields?.pagamento_id);
            }

            if (fields?.parcela) {
                updates?.push(`parcela = $${updates?.length + 1}`);
                values.push(fields?.parcela);
            }

            if (fields?.valor_pacela) {
                updates?.push(`valor_pacela = $${updates?.length + 1}`);
                values.push(fields?.valor_pacela);
            }

            if (fields?.url_pedido) {
                updates?.push(`url_pedido = $${updates?.length + 1}`);
                values.push(fields?.url_pedido);
            }

            if (fields?.url_cobranca) {
                updates?.push(`url_cobranca = $${updates?.length + 1}`);
                values.push(fields?.url_cobranca);
            }

            updates?.push(`data_atualizacao = CURRENT_TIMESTAMP`);

            const setClause = updates?.join(", ");

            await sql.query(
                `
                UPDATE conta_receber SET ${setClause} 
                WHERE _id = $${values.length + 1}
                RETURNING *;
            `,
                [...values, data.data.conta_receber._id]
            );

            return await model_conta_receber.buscar_pelo_id({data: {_id: data.data.conta_receber._id, excluido: false}}, c);
        } catch (error) {
            return helpers.set_response.error.DATABASE_ERROR({message: "Erro ao atualizar campos no model conta_receber!"}) as any;
        }
    }

    static async deletar_pelo_id(id: string, c: t.Context): Promise<t.Controllers.ContaReceber.DeletarPeloId.Output> {
        const sql = helpers.conn_neon.get_connection(c.env);

        const result = await sql`
            UPDATE conta_receber 
            SET 
                excluido = TRUE,
                data_exclusao = NOW(),
                usuario_exclusao = ${c.get("usuario_auth")._id},
                status = 502
            WHERE _id = ${id}
            AND excluido = FALSE
            RETURNING *
        `;

        return {
            data: {
                conta_receber: result[0],
            },
        };
    }

    static async CREATE_TABLE_IF_NOT_EXISTS(c: t.Context) {
        const sql = helpers.conn_neon.get_connection(c.env);

        await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`;

        await sql`
            CREATE TABLE IF NOT EXISTS conta_receber (
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
                cliente_id uuid NOT NULL,
                parcelas INTEGER NOT NULL,
                valor INTEGER NOT NULL,
                vencimento TEXT,
                codigo TEXT NOT NULL,
                metodo_pagamento TEXT[] NOT NULL,
                tipo_pagamento INTEGER NOT NULL,
                descricao TEXT,
                referencia_externa_primaria TEXT,
                referencia_externa_secundaria TEXT,
                referencia_externa_terciaria TEXT,
                referencia_externa_quartenaria TEXT,
                ativo BOOLEAN DEFAULT TRUE NOT NULL,
                documento_titular TEXT,
                titular TEXT,
                status INTEGER DEFAULT 500,
                numero_cartao TEXT,
                numero_serial TEXT,
                pagamento_id TEXT,
                parcela INTEGER,
                valor_pacela INTEGER,
                url_pedido TEXT,
                url_cobranca TEXT,
                metadata JSONB,
                data_pagamento TIMESTAMP WITH TIME ZONE,

                CONSTRAINT fk_status FOREIGN KEY (status) REFERENCES helpers(_id),
                CONSTRAINT fk_cliente_id FOREIGN KEY (cliente_id) REFERENCES helpers(_id)
            )
        `;
    }
};

export default model_conta_receber;
