typescript
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import t from "../../../types";
import utils from "onda-utils";

type FormData = t.Controllers.Latir.Criar.Input;

const store_latir = new utils.controller<t.Controllers.Latir.TController>({
    entidade: "latir",
    servidor: "worker_latir",
});

interface LatirFormularioProps {
    atualizar?: t.Controllers.Latir.BuscarPeloId.Output["data"]["latir"];
}

export const LatirFormulario: React.FC<LatirFormularioProps> = ({ atualizar }) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(t.Controllers.Latir.Criar.InputSchema as any),
        mode: "onSubmit",
        defaultValues: {
            data: {
                latir: {
                    descricao: atualizar?.descricao || "",
                    tipo: atualizar?.tipo || "",
                    valor: atualizar?.valor || 0,
                    data: atualizar?.data || "",
                    categoria: atualizar?.categoria || "",
                    usuario_id: atualizar?.usuario_id || 0,
                    raca: atualizar?.raca || "",
                    idade: atualizar?.idade || "",
                },
            },
        },
    });

    async function onSubmit(data: FormData) {
        if (atualizar) {
            await store_latir.api.atualizar(data);
        } else {
            await store_latir.api.criar(data);
        }
        reset();
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 bg-white rounded-lg shadow-md">
            <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Descrição</label>
                <Controller
                    name="data.latir.descricao"
                    control={control}
                    render={({ field }) => (
                        <input
                            {...field}
                            className={w-full border rounded p-2 ${
                                errors.data?.latir?.descricao ? "border-red-500" : "border-gray-300"
                            }}
                        />
                    )}
                />
                {errors.data?.latir?.descricao && <p className="text-red-500 text-xs italic">{errors.data.latir.descricao.message}</p>}
            </div>

            <div className="mt-4">
                <label className="block mb-2 text-sm font-semibold text-gray-700">Tipo</label>
                <Controller
                    name="data.latir.tipo"
                    control={control}
                    render={({ field }) => (
                        <input
                            {...field}
                            className={w-full border rounded p-2 ${
                                errors.data?.latir?.tipo ? "border-red-500" : "border-gray-300"
                            }}
                        />
                    )}
                />
                {errors.data?.latir?.tipo && <p className="text-red-500 text-xs italic">{errors.data.latir.tipo.message}</p>}
            </div>

            <div className="mt-4">
                <label className="block mb-2 text-sm font-semibold text-gray-700">Valor</label>
                <Controller
                    name="data.latir.valor"
                    control={control}
                    render={({ field }) => (
                        <input
                            type="number"
                            {...field}
                            className={w-full border rounded p-2 ${
                                errors.data?.latir?.valor ? "border-red-500" : "border-gray-300"
                            }}
                        />
                    )}
                />
                {errors.data?.latir?.valor && <p className="text-red-500 text-xs italic">{errors.data.latir.valor.message}</p>}
            </div>

            <div className="mt-4">
                <label className="block mb-2 text-sm font-semibold text-gray-700">Data</label>
                <Controller
                    name="data.latir.data"
                    control={control}
                    render={({ field }) => (
                        <input
                            type="date"
                            {...field}
                            className={w-full border rounded p-2 ${
                                errors.data?.latir?.data ? "border-red-500" : "border-gray-300"
                            }}
                        />
                    )}
                />
                {errors.data?.latir?.data && <p className="text-red-500 text-xs italic">{errors.data.latir.data.message}</p>}
            </div>

            <div className="mt-4">
                <label className="block mb-2 text-sm font-semibold text-gray-700">Categoria</label>
                <Controller
                    name="data.latir.categoria"
                    control={control}
                    render={({ field }) => (
                        <input
                            {...field}
                            className={w-full border rounded p-2 ${
                                errors.data?.latir?.categoria ? "border-red-500" : "border-gray-300"
                            }}
                        />
                    )}
                />
                {errors.data?.latir?.categoria && <p className="text-red-500 text-xs italic">{errors.data.latir.categoria.message}</p>}
            </div>

            <div className="mt-4">
                <label className="block mb-2 text-sm font-semibold text-gray-700">Raça</label>
                <Controller
                    name="data.latir.raca"
                    control={control}
                    render={({ field }) => (
                        <input
                            {...field}
                            className={w-full border rounded p-2 ${
                                errors.data?.latir?.raca ? "border-red-500" : "border-gray-300"
                            }}
                        />
                    )}
                />
                {errors.data?.latir?.raca && <p className="text-red-500 text-xs italic">{errors.data.latir.raca.message}</p>}
            </div>

            <div className="mt-4">
                <label className="block mb-2 text-sm font-semibold text-gray-700">Idade</label>
                <Controller
                    name="data.latir.idade"
                    control={control}
                    render={({ field }) => (
                        <input
                            {...field}
                            className={w-full border rounded p-2 ${
                                errors.data?.latir?.idade ? "border-red-500" : "border-gray-300"
                            }}
                        />
                    )}
                />
                {errors.data?.latir?.idade && <p className="text-red-500 text-xs italic">{errors.data.latir.idade.message}</p>}
            </div>

            <button type="submit" className="mt-6 w-full bg-blue-600 text-white rounded p-2 hover:bg-blue-700">
                {atualizar ? "Atualizar" : "Criar"}
            </button>
        </form>
    );
};
