export default async function utils_gerar_uuid_v4(): Promise<string> {
    return crypto.randomUUID();
}
