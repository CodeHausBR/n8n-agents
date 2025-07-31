//BIBLIOTECAS
import {neon, neonConfig, NeonQueryFunction} from "@neondatabase/serverless";
//HELPERS

//BANCO DE DADOS

//SERVICES
//TYPES
import t from "../../../types";

neonConfig.useSecureWebSocket = true;
neonConfig.wsProxy = "https://us-east.hyperdrive.neon.tech";
neonConfig.pipelineTLS = true;

const get_connection_neon = class get_connection_neon {
    static sqlClient: NeonQueryFunction<false, false> | null = null;

    static get_connection(env: t.Env) {
        if (!this.sqlClient) this.sqlClient = neon(env.POSTGRESQL_DATABASE_URL);
        return this.sqlClient;
    }
};

export default get_connection_neon;
