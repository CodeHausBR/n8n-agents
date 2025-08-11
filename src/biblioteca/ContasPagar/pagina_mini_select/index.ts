typescript
import React, { useEffect, useState } from "react";
import { Search, Check, ChevronsLeft, ChevronsRight } from "lucide-react";

import utils from "onda-utils";
import t from "onda-types";

interface MiniSelectContasPagarProps {
    showActions?: boolean;
}

export const PaginaMiniSelectContasPagar: React.FC<MiniSelectContasPagarProps> = ({ showActions = true }) => {
    const store_contas_pagar = new utils.controller<t.Banco.Controllers.ContasPagar.TController>({ entidade: "contaPagar" });
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    const get_pagina_contas_pagar = store_contas_pagar.get_jsx.pagina_mini_select;

    async function buscarDados(pagina: number, termo_busca: string) {
        await store_contas_pagar.api.buscar_pelo_filtro({
            filtros: {
                contaPagar: {
                    pagina: pagina || 1,
                    descricao: termo_busca,
                },
            },
        });
    }

    useEffect(() => {
        buscarDados(1, "");
    }, []);

    function handleBuscar() {
        setPaginaAtual(1);
        buscarDados(1, searchTerm);
    }

    function handleSelectItem(contaPagar: t.Banco.Controllers.ContasPagar.ContasPagarBase) {
        store_contas_pagar.set_state((store) => {
            store.pagina_mini_select.item_selecionado = contaPagar;
        });
    }

    const totalItens = get_pagina_contas_pagar?.paginacao?.total_itens || 0;
    const totalPaginas = Math.ceil(totalItens / get_pagina_contas_pagar?.paginacao?.itens_por_pagina);

    function irParaPagina(pagina: number) {
        if (pagina >= 1 && pagina <= totalPaginas) {
            setPaginaAtual(pagina);
            buscarDados(pagina, searchTerm);
        }
    }

    const gerarBotoesPaginacao = () => {
        const botoes = [];
        const maxBotoes = 3;

        let inicio = Math.max(1, paginaAtual - Math.floor(maxBotoes / 2));
        let fim = Math.min(totalPaginas, inicio + maxBotoes - 1);

        if (fim - inicio + 1 < maxBotoes) {
            inicio = Math.max(1, fim - maxBotoes + 1);
        }

        for (let i = inicio; i <= fim; i++) {
            botoes.push(
                <button
                    style={{ height: "27px", width: "20px", justifyContent: "center", alignItems: "center", display: "flex" }}
                    color={paginaAtual === i ? "standard" : "basic"}
                    key={i}
                    onClick={() => irParaPagina(i)}
                >
                    {i}
                </button>
            );
        }

        return botoes;
    };

    return (
        <div className="bg-white rounded-lg flex flex-col h-full">
            {/* Header com busca */}
            <div className="p-4 border-b border-gray-200 flex-shrink-0">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-medium text-gray-700 mb-3">Selecionar Conta a Pagar</h3>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        color="primary"
                        type="search"
                        placeholder="Buscar conta a pagar pelo descrição..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyUp={(e) => e.key === "Enter" && handleBuscar()}
                    />
                </div>
            </div>

            {/* Lista de contas a pagar */}
            <div className="flex-1 overflow-y-auto p-3 min-h-0">
                {get_pagina_contas_pagar?.loading && (
                    <div className="flex items-center justify-center py-8">
                        <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#f97316]"></div>
                            <span className="text-sm text-gray-600">Buscando contas a pagar...</span>
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    {get_pagina_contas_pagar?.itens?.map((contaPagar) => (
                        <div
                            key={contaPagar.id}
                            onClick={() => handleSelectItem(contaPagar)}
                            className={p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                                get_pagina_contas_pagar?.item_selecionado?.id === contaPagar.id
                                    ? "border-[#f97316] bg-[#fff7ed] shadow-sm"
                                    : "border-gray-200 bg-white hover:border-gray-300"
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-medium text-gray-900 truncate text-sm">{contaPagar.descricao}</h4>
                                        {get_pagina_contas_pagar?.item_selecionado?.id === contaPagar.id && <Check className="w-4 h-4 text-[#f97316] flex-shrink-0" />}
                                    </div>

                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <span className="font-mono">{Valor: R$ ${contaPagar.valor.toFixed(2)}}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="font-mono">{Data: ${contaPagar.data}}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="font-mono">{Categoria: ${contaPagar.categoria}}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {!get_pagina_contas_pagar?.loading && get_pagina_contas_pagar?.itens?.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            <span className="w-12 h-12 mx-auto mb-3 text-gray-300">⚠️</span>
                            <p className="text-sm">Nenhuma conta a pagar encontrada</p>
                            <p className="text-xs text-gray-400 mt-1">Tente ajustar sua busca</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer com paginação e ações */}
            <div className="p-3 border-t border-gray-200 flex-shrink-0">
                {/* Paginação */}
                {totalPaginas > 1 && (
                    <div className="flex items-center justify-center mb-3">
                        <div className="flex items-center space-x-1">
                            <button color="basic" onClick={() => irParaPagina(1)} disabled={paginaAtual === 1 || get_pagina_contas_pagar?.loading} title="Primeira página">
                                <ChevronsLeft className="w-3 h-3" />
                            </button>
                            <button color="basic" onClick={() => irParaPagina(paginaAtual - 1)} disabled={paginaAtual === 1 || get_pagina_contas_pagar?.loading} title="Página anterior">
                                <div className="w-3 h-3" />
                            </button>
                            <div className="flex items-center space-x-1">{gerarBotoesPaginacao()}</div>
                            <button
                                color="basic"
                                onClick={() => irParaPagina(paginaAtual + 1)}
                                disabled={paginaAtual === totalPaginas || get_pagina_contas_pagar?.loading}
                                title="Próxima página"
                            >
                                <div className="w-3 h-3" />
                            </button>
                            <button
                                color="basic"
                                onClick={() => irParaPagina(totalPaginas)}
                                disabled={paginaAtual === totalPaginas || get_pagina_contas_pagar?.loading}
                                title="Última página"
                            >
                                <ChevronsRight className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Ações */}
                {showActions && (
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="text-xs text-gray-500">
                            {totalItens} conta{totalItens !== 1 ? "s" : ""} encontrada{totalItens !== 1 ? "s" : ""}
                        </div>
                        {get_pagina_contas_pagar?.item_selecionado ? (
                            <span className="flex items-center gap-1">
                                <Check className="w-3 h-3 text-green-500" />
                                {get_pagina_contas_pagar?.item_selecionado.descricao}
                            </span>
                        ) : (
                            "Selecione uma conta a pagar acima"
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
