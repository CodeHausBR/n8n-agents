import React, {useEffect, useState} from "react";
import {Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Check, X, AlertCircle, CheckCircle, Clock} from "lucide-react";

import utils from "onda-utils";
import t from "../../../types";

const store_log = new utils.controller<t.Controllers.Log.TController>({
    entidade: "log",
    servidor: "worker_financeiro",
});

export function ButtonOpenLogPagina({matrix}: {matrix?: string}) {
    return (
        <button
            onClick={() =>
                store_log.set_state((store) => {
                    store.modal.item = {_id: matrix};
                    store.modal.open = true;
                })
            }
            className="group inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:border-gray-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:border-blue-500 transition-all duration-200 ease-in-out"
        >
            <Clock className="w-4 h-4 text-gray-500 group-hover:text-blue-600 transition-colors duration-200" />
            Ver Logs
        </button>
    );
}

export default function LogPagina() {
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [isClosing, setIsClosing] = useState(false);

    const get_pagina_log = store_log.get_jsx.pagina_mini_select;

    async function buscarDados() {
        await store_log.api.buscar_pelo_filtro({
            filtros: {
                log: {
                    matrix: store_log?.get_state?.modal?.item?._id,
                },
            },
        });
    }

    useEffect(() => {
        if (store_log?.get_state?.modal?.open == true) {
            buscarDados();
        }
    }, [store_log?.get_state?.modal?.open]);

    function handleSelectItem(log: string) {
        store_log.set_state((store) => {
            store.modal.item = log;
        });
    }

    function onClose() {
        setIsClosing(true);
        setTimeout(() => {
            store_log.set_state((store) => {
                store.modal.open = false;
            });

            setIsClosing(false);
        }, 300);
    }

    const totalItens = get_pagina_log?.paginacao?.total_itens || 0;
    const totalPaginas = Math.ceil(totalItens / (get_pagina_log?.paginacao?.itens_por_pagina || 1));

    function irParaPagina(pagina: number) {
        if (pagina >= 1 && pagina <= totalPaginas) {
            setPaginaAtual(pagina);
            buscarDados();
        }
    }

    const gerarBotoesPaginacao = () => {
        const botoes = [];
        const maxBotoes = 5;

        let inicio = Math.max(1, paginaAtual - Math.floor(maxBotoes / 2));
        let fim = Math.min(totalPaginas, inicio + maxBotoes - 1);

        if (fim - inicio + 1 < maxBotoes) {
            inicio = Math.max(1, fim - maxBotoes + 1);
        }

        for (let i = inicio; i <= fim; i++) {
            botoes.push(
                <button
                    key={i}
                    onClick={() => irParaPagina(i)}
                    className={`flex items-center justify-center min-w-[2.5rem] h-10 px-3 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out ${
                        paginaAtual === i
                            ? "bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:shadow-xl focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105"
                    } ${get_pagina_log?.loading ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
          `}
                    disabled={get_pagina_log?.loading}
                >
                    {i}
                </button>
            );
        }

        return botoes;
    };

    const getLogIcon = (type: string) => {
        switch (type) {
            case "error":
                return <AlertCircle className="w-4 h-4 text-red-500" />;
            case "success":
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            default:
                return <Clock className="w-4 h-4 text-blue-500" />;
        }
    };

    const getLogTypeColor = (type: string) => {
        switch (type) {
            case "error":
                return "bg-red-50 border-red-200 text-red-800";
            case "success":
                return "bg-green-50 border-green-200 text-green-800";
            default:
                return "bg-blue-50 border-blue-200 text-blue-800";
        }
    };

    return (
        <>
            {store_log?.get_jsx?.modal?.open === true && (
                <div className="fixed inset-0 z-[9999] overflow-hidden">
                    <div
                        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300 ease-out ${isClosing ? "opacity-0" : "opacity-100"}`}
                        onClick={onClose}
                        aria-hidden="true"
                    />

                    <div className="fixed inset-y-0 z-[10000] right-0 flex max-w-full pl-10 sm:pl-16">
                        <div
                            className={`w-screen max-w-150 transform transition-all duration-300 ease-out ${
                                isClosing ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
                            }`}
                        >
                            <div className="flex h-full flex-col bg-white shadow-2xl ring-1 ring-black/5">
                                <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-6 py-6 text-white relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>

                                    <div className="flex items-center justify-between relative z-10">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm ring-1 ring-white/30">
                                                <Clock className="h-6 w-6" />
                                            </div>
                                        </div>
                                        <button
                                            onClick={onClose}
                                            className="rounded-xl p-2.5 text-white/80 hover:bg-white/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 hover:scale-110 hover:rotate-90 transform"
                                        >
                                            <X className="h-6 w-6" />
                                        </button>
                                    </div>
                                </div>

                                {/* Content com scroll suave */}
                                <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
                                    <div className="px-6 py-6">
                                        {/* Loading State melhorado */}
                                        {get_pagina_log?.loading && (
                                            <div className="flex flex-col items-center justify-center py-16">
                                                <div className="relative">
                                                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
                                                    <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full border-4 border-blue-300 opacity-20" />
                                                </div>
                                                <p className="mt-4 text-base font-semibold text-gray-700">Carregando logs...</p>
                                                <p className="text-sm text-gray-500">Aguarde enquanto buscamos os dados</p>
                                            </div>
                                        )}

                                        {/* Log List com animações */}
                                        <div className="space-y-4">
                                            {get_pagina_log?.itens?.map((log, index) => (
                                                <div
                                                    key={log._id}
                                                    onClick={() => handleSelectItem(log._id)}
                                                    className={`group relative cursor-pointer rounded-2xl border-2 bg-white p-5 shadow-sm transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 ${
                                                        get_pagina_log?.item_selecionado?._id === log._id
                                                            ? "border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg ring-4 ring-blue-500/10 transform scale-[1.02]"
                                                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"
                                                    }`}
                                                    style={{
                                                        animationDelay: `${index * 50}ms`,
                                                        animation: `slideInUp 0.5s ease-out ${index * 50}ms both`,
                                                    }}
                                                >
                                                    <div className="flex items-start space-x-4">
                                                        <div className="flex-shrink-0 pt-1 transform group-hover:scale-110 transition-transform duration-200">
                                                            {getLogIcon(log.type)}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex items-center justify-between mb-3">
                                                                <div className="flex items-center space-x-3">
                                                                    <span
                                                                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset transition-all duration-200 ${getLogTypeColor(
                                                                            log.type
                                                                        )}`}
                                                                    >
                                                                        {log.type === "error" && "Erro"}
                                                                        {log.type === "log" && "Sucesso"}
                                                                    </span>
                                                                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                                                                        #{index + 1}
                                                                    </span>
                                                                </div>
                                                                <time className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">{log.created_at}</time>
                                                            </div>
                                                            <p className="text-sm text-gray-900 leading-relaxed line-clamp-2 group-hover:text-gray-700">
                                                                {log.error_message || "Sem mensagem disponível"}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Selection Indicator aprimorado */}
                                                    {get_pagina_log?.item_selecionado?._id === log._id && (
                                                        <div className="absolute right-4 top-4">
                                                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 shadow-lg ring-4 ring-blue-500/20 animate-pulse">
                                                                <Check className="h-3.5 w-3.5 text-white" />
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Hover effect */}
                                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                                </div>
                                            ))}

                                            {/* Empty State melhorado */}
                                            {!get_pagina_log?.loading && get_pagina_log?.itens?.length === 0 && (
                                                <div className="flex flex-col items-center justify-center py-16">
                                                    <div className="rounded-full bg-gradient-to-br from-gray-100 to-gray-200 p-4 shadow-inner">
                                                        <Search className="h-10 w-10 text-gray-400" />
                                                    </div>
                                                    <h3 className="mt-6 text-xl font-semibold text-gray-900">Nenhum log encontrado</h3>
                                                    <p className="mt-3 text-center text-sm text-gray-500 max-w-md leading-relaxed">
                                                        Não encontramos logs que correspondam aos seus critérios de busca.
                                                        <br />
                                                        Tente ajustar os filtros ou verificar novamente mais tarde.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Footer com Pagination aprimorada */}
                                {totalPaginas > 1 && (
                                    <div className="border-t border-gray-200 bg-gradient-to-r from-white to-gray-50 px-6 py-5">
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm text-gray-700 font-medium">
                                                Mostrando{" "}
                                                <span className="font-bold text-blue-600">{(paginaAtual - 1) * (get_pagina_log?.paginacao?.itens_por_pagina || 10) + 1}</span> até{" "}
                                                <span className="font-bold text-blue-600">
                                                    {Math.min(paginaAtual * (get_pagina_log?.paginacao?.itens_por_pagina || 10), totalItens)}
                                                </span>{" "}
                                                de <span className="font-bold text-gray-900">{totalItens}</span> logs
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => irParaPagina(1)}
                                                    disabled={paginaAtual === 1 || get_pagina_log?.loading}
                                                    className="inline-flex items-center justify-center h-10 w-10 rounded-xl border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 hover:border-gray-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:scale-105"
                                                    title="Primeira página"
                                                >
                                                    <ChevronsLeft className="h-4 w-4" />
                                                </button>

                                                <button
                                                    onClick={() => irParaPagina(paginaAtual - 1)}
                                                    disabled={paginaAtual === 1 || get_pagina_log?.loading}
                                                    className="inline-flex items-center justify-center h-10 w-10 rounded-xl border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 hover:border-gray-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:scale-105"
                                                    title="Página anterior"
                                                >
                                                    <ChevronLeft className="h-4 w-4" />
                                                </button>

                                                <div className="flex items-center space-x-1">{gerarBotoesPaginacao()}</div>

                                                <button
                                                    onClick={() => irParaPagina(paginaAtual + 1)}
                                                    disabled={paginaAtual === totalPaginas || get_pagina_log?.loading}
                                                    className="inline-flex items-center justify-center h-10 w-10 rounded-xl border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 hover:border-gray-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:scale-105"
                                                    title="Próxima página"
                                                >
                                                    <ChevronRight className="h-4 w-4" />
                                                </button>

                                                <button
                                                    onClick={() => irParaPagina(totalPaginas)}
                                                    disabled={paginaAtual === totalPaginas || get_pagina_log?.loading}
                                                    className="inline-flex items-center justify-center h-10 w-10 rounded-xl border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 hover:border-gray-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:scale-105"
                                                    title="Última página"
                                                >
                                                    <ChevronsRight className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
