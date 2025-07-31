import z4, { string } from "zod/v4";

namespace UserPayload {
  export const UserPayloadImobiliariaSchema = z4.object({
    onda_colaborador_email: z4.email(),
    onda_colaborador_name: z4.string(),
    onda_imob_email: z4.email(),
    onda_imob_codigo: z4.string(),
    onda_imob_status_register: z4.number(),
    onda_imob_cpfcnpj: z4.string(),
    onda_imob_nome: z4.string(),
    onda_imob_telefone: z4.string(),
    onda_imob_razaosocial: z4.string(),
    onda_imob_celular: z4.string(),
    onda_imob_executivo: z4.number(),
    onda_imob_parceiro: z4.number(),
    onda_imob_id: z4.string(),
    onda_colaborador_id: z4.number(),
    type_user: z4.literal("imobiliaria"),
    iat: z4.number().optional(),
    organizacao: z4.string(),
    app: z4.string().optional(),
  });

  export type UserPayloadImobiliaria = z4.infer<typeof UserPayloadImobiliariaSchema>;

  export const UserPayloadWaveSchema = z4.object({
    onda_user_username: z4.string(),
    onda_user_departamento: z4.string(),
    onda_user_email: z4.email(),
    onda_user_id: z4.string(),
    onda_imob_id: z4.string(),
    onda_colaborador_id: z4.number(),
    type_user: z4.literal("ONDA_USER"),
    iat: z4.number().optional(),
    organizacao: z4.string(),
    app: z4.string().optional(),
  });

  export type UserPayloadWave = z4.infer<typeof UserPayloadWaveSchema>;


  export const PatternUserPayloadSchema = z4.discriminatedUnion("type_user", [
    UserPayloadImobiliariaSchema,
    UserPayloadWaveSchema,
  ]);

  export type PatternUserPayload = z4.infer<typeof PatternUserPayloadSchema>;

  export const AuthPayloadSchema = PatternUserPayloadSchema;
  export type AuthPayload = PatternUserPayload;

  const userToken = z4.object({
    _id: string(),
    tipo: string(),
    app: z4.literal("wave"),
  });

  export type UserToken = z4.infer<typeof userToken>;
}

export default UserPayload;
