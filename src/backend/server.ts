import package_json from "../../package.json";
import {Hono} from "hono";
import {cors} from "hono/cors";

const app = new Hono();

app.use(
    "/*",
    cors({
        origin: [
            "https://api-financeiro.codehaus.app",
            "https://sandbox-portal.ondasegura.com.br",
            "https://portal.ondasegura.com.br",
            "http://localhost:18000",
            "http://localhost:3000",
            "http://localhost:4704",
        ], // Permite apenas esse origin
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Métodos permitidos
        allowHeaders: ["Content-Type", "Authorization"], // Headers permitidos
        exposeHeaders: ["Content-Length", "X-Custom-Header"], // Headers expostos
        credentials: true, // Permite cookies/autorização (se necessário)
    })
);

app.get("/", (c) => c.json({message: "Sucesso!", v: package_json.version}));
// import route_conta_receber from ""
import route_conta_receber from "./routes/route_conta_receber/route_conta_receber";
import routeLogs from "./routes/routeLogs/route_log";
import routeHelper from "./routes/routeHelpers/routeHelpers";
import route_recebedor from "./routes/route_recebedor/route_recebedor";
import route_cliente from "./routes/route_cliente/route_cliente";
import route_webhook from "./routes/route_webhook/route_webhook";
import route_conta_pagar from "./routes/route_conta_pagar/route_conta_pagar";

const logsRoutes = new Hono().route("/", routeLogs);

app.route("/financeiro", logsRoutes);

app.route("/financeiro", route_conta_receber);

app.route("/financeiro", routeHelper);

app.route("/financeiro", route_recebedor);

app.route("/financeiro", route_cliente);

app.route("/financeiro", route_webhook);

app.route("/financeiro", route_conta_pagar);

export default {fetch: app.fetch};
