//HELPERS
import set_response from "./set_response/set_response";
import token from "./token/token";

import get_connection_neon from "./get_connection_neon/get_connection_neon";

const helpers = class helpers {
    static set_response = set_response;

    static token = token;

    static conn_neon = get_connection_neon;
    static banco_dados: any;
};

export default helpers;
