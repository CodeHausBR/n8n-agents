import {useEffect, useState} from "react";
import {CreditCard} from "lucide-react";

import utils from "onda-utils";

import {ContaReceberPagina} from "src/biblioteca/conta_receber/pagina";
import LogPagina from "src/biblioteca/log/pagina";

const entities = [
    {id: 1, name: "Contas a Receber", icon: CreditCard, component: "ContasReceber"},
    // {id: 2, name: "Log", icon: Code, component: "Log"},
    // {id: 3, name: "Recebedor", icon: Users, component: "Recebedor"},
    // {id: 4, name: "Contas a Pagar", icon: Package, component: "Contas a Pagar"},
    // {id: 5, name: "Helper", icon: Sparkles, component: "Helpers"},
];

const store_log = new utils.controller({
    entidade: "log",
    servidor: "worker_financeiro",
});

const ContasReceber = () => <ContaReceberPagina setReferenciaExternaPrimaria="contrato" />;

const ContasPagar = () => (
    <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Contas a Pagar</h1>
        <p className="text-gray-300">Componente ContasPagar importado.</p>
        <div className="mt-4 p-4 bg-slate-800 rounded-lg">
            <p className="text-sm text-gray-400">
                Substitua este componente pelo seu import real:
                <br />
                <code className="text-purple-300">import ContasPagar from 'src/components/ContasPagar';</code>
            </p>
        </div>
    </div>
);

const Recebedor = () => (
    <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Recebedor</h1>
        <p className="text-gray-300">Componente Recebedor importado.</p>
        <div className="mt-4 p-4 bg-slate-800 rounded-lg">
            <p className="text-sm text-gray-400">
                Substitua este componente pelo seu import real:
                <br />
                <code className="text-purple-300">import Recebedor from 'src/components/Recebedor';</code>
            </p>
        </div>
    </div>
);

const Log = () => {
    return (
        <div>
            <LogPagina />
        </div>
    );
};

const Helpers = () => (
    <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Helpers</h1>
        <p className="text-gray-300">Componente Helpers importado.</p>
        <div className="mt-4 p-4 bg-slate-800 rounded-lg">
            <p className="text-sm text-gray-400">
                Substitua este componente pelo seu import real:
                <br />
                <code className="text-purple-300">import Helpers from 'src/components/Helpers';</code>
            </p>
        </div>
    </div>
);

// Mapeamento dos componentes
const componentMap = {
    ContasReceber: ContasReceber,
    ContasPagar: ContasPagar,
    Recebedor: Recebedor,
    Log: Log,
    Helpers: Helpers,
} as any;

function EntityContent({entityId}: any) {
    const entity = entities.find((e) => e.id === entityId);

    if (!entity) {
        return (
            <div className="p-6">
                <h1 className="text-3xl font-bold mb-4">Lista de Entidades</h1>
                <p className="text-gray-300">Selecione uma entidade na lista lateral para visualizar seu conteúdo.</p>
            </div>
        );
    }

    if (entity.component === "Log") {
        return (
            <div className="p-6">
                <h1 className="text-3xl font-bold mb-4">Logs</h1>
                <p className="text=-gray-300">Clique no botão "Logs" na barra lateral para abrir a visualização detalhada.</p>
            </div>
        );
    }

    const Component = componentMap[entity.component];

    if (!Component) {
        return (
            <div className="p-6">
                <h1 className="text-3xl font-bold mb-4">Erro</h1>
                <p className="text-red-400">Componente '{entity.component}' não encontrado.</p>
            </div>
        );
    }

    return <Component />;
}

export default function ListaDeEntidades() {
    const [entidadeSelecionada, setEntidadeSelecionada] = useState<number | null>(null);
    useEffect(() => {
        return window.localStorage.setItem(
            "auth_user",
            JSON.stringify({
                status: 201,
                type: "success",
                code: "SUCCESS",
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub21lIjoiTGVub24iLCJlbWFpbCI6Imxlbm9uLnJhbW9zQG9uZGFzZWcuY29tLmJyIiwiaWQiOjE1MSwib25kYV91c2VyX2lkIjoxNTEsImNvZGlnbyI6IlVTRVItNTgyMjg2NzAwMDgtMjAyNCIsInR5cGVfdXNlciI6Ik9OREFfVVNFUiIsIm9yZ2FuaXphY2FvIjoib25kYV9zZWd1cmEiLCJhcHAiOiJ3YXZlIiwiaWF0IjoxNzUzNDYyNzcxfQ.1Le3rVQ5A3EaeKJUUFhHF69xRC_49lGavLqWvmuAcq4",
                nome: "Lenon",
                email: "lenon.ramos@ondaseg.com.br",
                id: 151,
                codigo: "USER-58228670008-2024",
                type_user: "ONDA_USER",
                message: "Login efetuado com sucesso!",
            })
        );
    }, []);

    const handleLogButtonClick = (entidadeId: number) => {
        setEntidadeSelecionada(entidadeId);
        if (entidadeId === 2) {
            store_log.set_state((store: any) => {
                store.modal.item = {_id: undefined};
                store.modal.open = true;
            });
        }
    };

    const handleClickEntidade = (entidadeId: number) => {
        setEntidadeSelecionada(entidadeId);
        if (entidadeId !== 2) {
            store_log.set_state((store: any) => {
                store.modal.open = false;
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex">
            {/* Sidebar com lista de entidades */}
            <div className="w-64 bg-slate-800/50 backdrop-blur-sm border-r border-slate-700">
                <div className="p-4 border-b border-slate-700">
                    <h2 className="text-4xl font-bold text-white">Entidades</h2>
                </div>
                <nav className="p-2">
                    {entities.map((entity: any) => {
                        const IconComponent = entity.icon;
                        const isLogEntity = entity.component === "Log";

                        const handleClick = isLogEntity ? () => handleLogButtonClick(entity.id) : () => handleClickEntidade(entity.id);

                        return (
                            <button
                                key={entity.id}
                                onClick={handleClick}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                                    entidadeSelecionada === entity.id ? "bg-purple-600 text-white" : "text-gray-300 hover:bg-slate-700 hover:text-white"
                                }`}
                            >
                                <IconComponent size={22} />
                                <span className="text-lg font-medium">{entity.name}</span>
                                <span className="text-xs text-gray-400 ml-auto">#{entity.id}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Área principal de conteúdo */}
            <div className="flex-1">
                <EntityContent entityId={entidadeSelecionada} />
            </div>
        </div>
    );
}
