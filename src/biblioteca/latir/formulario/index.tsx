javascript
"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import t from "onda-types";
import controller_latir from "../../../controllers/controller_latir";

const schema = t.Cachorro.Controllers.Latir.Criar.InputSchema;
type FormData = t.Cachorro.Controllers.Latir.Criar.Input;

export default function FormCriarLatir() {
  const [isPending, startTransition] = useTransition();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      data: {
        descricao: "",
        tipo: "",
        valor: 0,
        data: "",
        categoria: "",
        usuario_id: 0,
        raca: "",
        idade: "",
      },
    },
  });

  const onSubmit = (data: FormData) => {
    startTransition(async () => {
      try {
        await controller_latir.api.criar(data);
        reset();
      } catch (error) {
        console.error("Erro ao salvar latir:", error);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 space-y-6">
          {/* Descrição */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Descrição
            </label>
            <Controller
              name="data.descricao"
              control={control}
              render={({ field }) => (
                <input
                  type="text"
                  {...field}
                  className={w-full px-4 py-4 text-gray-800 bg-gray-50 border-2 rounded-2xl focus:outline-none focus:bg-white transition-all duration-200 ${errors.data?.descricao ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100" : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"}}
                />
              )}
            />
            {errors.data?.descricao && (
              <p className="text-red-500 text-sm">{errors.data.descricao.message}</p>
            )}
          </div>

          {/* Tipo */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tipo
            </label>
            <Controller
              name="data.tipo"
              control={control}
              render={({ field }) => (
                <input
                  type="text"
                  {...field}
                  className={w-full px-4 py-4 text-gray-800 bg-gray-50 border-2 rounded-2xl focus:outline-none focus:bg-white transition-all duration-200 ${errors.data?.tipo ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100" : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"}}
                />
              )}
            />
            {errors.data?.tipo && (
              <p className="text-red-500 text-sm">{errors.data.tipo.message}</p>
            )}
          </div>

          {/* Valor */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Valor
            </label>
            <Controller
              name="data.valor"
              control={control}
              render={({ field }) => (
                <input
                  type="number"
                  {...field}
                  className={w-full px-4 py-4 text-gray-800 bg-gray-50 border-2 rounded-2xl focus:outline-none focus:bg-white transition-all duration-200 ${errors.data?.valor ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100" : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"}}
                />
              )}
            />
            {errors.data?.valor && (
              <p className="text-red-500 text-sm">{errors.data.valor.message}</p>
            )}
          </div>

          {/* Data */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Data
            </label>
            <Controller
              name="data.data"
              control={control}
              render={({ field }) => (
                <input
                  type="text"
                  {...field}
                  placeholder="YYYY-MM-DD"
                  className={w-full px-4 py-4 text-gray-800 bg-gray-50 border-2 rounded-2xl focus:outline-none focus:bg-white transition-all duration-200 ${errors.data?.data ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100" : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"}}
                />
              )}
            />
            {errors.data?.data && (
              <p className="text-red-500 text-sm">{errors.data.data.message}</p>
            )}
          </div>

          {/* Categoria */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Categoria
            </label>
            <Controller
              name="data.categoria"
              control={control}
              render={({ field }) => (
                <input
                  type="text"
                  {...field}
                  className={w-full px-4 py-4 text-gray-800 bg-gray-50 border-2 rounded-2xl focus:outline-none focus:bg-white transition-all duration-200 ${errors.data?.categoria ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100" : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"}}
                />
              )}
            />
            {errors.data?.categoria && (
              <p className="text-red-500 text-sm">{errors.data.categoria.message}</p>
            )}
          </div>

          {/* Usuario ID */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Usuario ID
            </label>
            <Controller
              name="data.usuario_id"
              control={control}
              render={({ field }) => (
                <input
                  type="number"
                  {...field}
                  className={w-full px-4 py-4 text-gray-800 bg-gray-50 border-2 rounded-2xl focus:outline-none focus:bg-white transition-all duration-200 ${errors.data?.usuario_id ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100" : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"}}
                />
              )}
            />
            {errors.data?.usuario_id && (
              <p className="text-red-500 text-sm">{errors.data.usuario_id.message}</p>
            )}
          </div>

          {/* Raça */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Raça
            </label>
            <Controller
              name="data.raca"
              control={control}
              render={({ field }) => (
                <input
                  type="text"
                  {...field}
                  className={w-full px-4 py-4 text-gray-800 bg-gray-50 border-2 rounded-2xl focus:outline-none focus:bg-white transition-all duration-200 ${errors.data?.raca ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100" : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"}}
                />
              )}
            />
            {errors.data?.raca && (
              <p className="text-red-500 text-sm">{errors.data.raca.message}</p>
            )}
          </div>

          {/* Idade */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Idade
            </label>
            <Controller
              name="data.idade"
              control={control}
              render={({ field }) => (
                <input
                  type="text"
                  {...field}
                  className={w-full px-4 py-4 text-gray-800 bg-gray-50 border-2 rounded-2xl focus:outline-none focus:bg-white transition-all duration-200 ${errors.data?.idade ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100" : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"}}
                />
              )}
            />
            {errors.data?.idade && (
              <p className="text-red-500 text-sm">{errors.data.idade.message}</p>
            )}
          </div>

          {/* Botão de Submit */}
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isPending}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100"
          >
            {isPending ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                Salvando...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                🐾 Salvar Latir
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
