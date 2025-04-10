import 'dotenv/config';
import path from 'path';
import fs from 'fs';
import http from 'http';
import https from 'https';
import express, { Request, Response, NextFunction } from 'express';
import vhost from 'vhost';
import favicon from 'serve-favicon';

// Конфигурация доменов и путей
const DOMAINS = {
  HOST: "test.local",
  SUBDOMAIN: "sub.test.local",
} as const;

const PATHS = {
  ROOT: "/",
  EXAMPLES: "/examples",
} as const;

const app = express();

// Настройка Express: favicon и шаблонизатор
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')))
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Функция подготовки маршрутов для каждого домена
function prepareRouter(domain: string): express.RequestHandler {
  const router = express.Router();

  router
    .get(PATHS.ROOT, (_req: Request, res: Response) => (res.render("index", DOMAINS)))
    .get(PATHS.EXAMPLES, (_req: Request, res: Response) => (res.render("index", DOMAINS)));

  return vhost(domain, router as any);
}

// Подключаем маршруты для каждого домена
app.use(prepareRouter(DOMAINS.HOST));
app.use(prepareRouter(DOMAINS.SUBDOMAIN));

// Обработчик ошибок
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Произошла ошибка:", err);
  res.status(500).send("Внутренняя ошибка сервера");
});

const PORTS = {
  HTTP: 80,
  HTTPS: 443,
} as const;

// Создаем и запускаем HTTP-сервер
const httpServer = http.createServer(app).listen(PORTS.HTTP, () => console.log(`HTTP сервер запущен (port ${PORTS.HTTP})`));

// Создаем и запускаем HTTPS-сервер с использованием опций для SSL-сертификатов
const httpsServer = https.createServer({
  key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem'), { encoding: 'utf-8' }),
  cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'), { encoding: 'utf-8' }),
}, app).listen(PORTS.HTTPS, () => console.log(`HTTPS сервер запущен (port ${PORTS.HTTPS})`));

// При запуске выведем список URL-адресов для каждого домена и протокола
setTimeout(() => {
  console.log('-------------------------------- \n');
  console.log(Object.values(PATHS).flatMap((route: string) =>
    Object.values(DOMAINS).flatMap((domain: string) =>
      [`http://${domain}${route}`, `https://${domain}${route}`, '\n']
    )
  ).flat().join('\n').slice(0, -1));
  console.log('--------------------------------');
})

process.on("unhandledRejection", (err) => {
  console.error("Произошла ошибка:", err);
  httpServer.close(() => process.exit(1));
  httpsServer.close(() => process.exit(1));
});
