import 'dotenv/config';
import path from 'path';
import fs from 'fs';
import http from 'http';
import https from 'https';
import express, { Request, Response, NextFunction } from 'express';
import vhost from 'vhost';
import favicon from 'serve-favicon';

// Конфигурация доменов и путей (оставляем как у вас)
const domains = {
  host: "test.local",
  subdomain: "sub.test.local",
} as const;

const paths = {
  root: "/",
  examples: "/examples",
} as const;

const app = express();

app.use(favicon(path.join(__dirname, 'public', 'favicon.png')))
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Функция подготовки маршрутов для каждого домена
function prepareRouter(domain: string): express.RequestHandler {
  const router = express.Router();

  router
    .get(paths.root, (req: Request, res: Response) => {
      res.render("index", domains);
    })
    .get(paths.examples, (req: Request, res: Response) => {
      res.render("index", domains);
    });

  return vhost(domain, router as any);
}

// Подключаем маршруты для каждого домена
app.use(prepareRouter(domains.host));
app.use(prepareRouter(domains.subdomain));

// Обработчик ошибок
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Произошла ошибка:", err);
  res.status(500).send("Внутренняя ошибка сервера");
});

// Определите порты для HTTP и HTTPS.
// Если используете стандартные порты (80/443), убедитесь, что у вас достаточно прав или выберите альтернативные (например, 8080 и 8443).
const httpPort = 80;
const httpsPort = 443;

// Для HTTPS-сервера потребуются сертификат и приватный ключ.
// Для демонстрации можно создать самоподписанные сертификаты командой:
//   openssl req -nodes -new -x509 -keyout server.key -out server.crt
// и разместить файлы в папке, например, './ssl'
const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, 'ssl', 'server.key')),
  cert: fs.readFileSync(path.join(__dirname, 'ssl', 'server.crt')),
};

// Создаем HTTP-сервер
const httpServer = http.createServer(app);

// Создаем HTTPS-сервер с использованием указанных опций
const httpsServer = https.createServer(httpsOptions, app);

// Запускаем HTTP-сервер
httpServer.listen(httpPort, () => {
  console.log(`HTTP сервер запущен на порту ${httpPort}`);
});

// Запускаем HTTPS-сервер
httpsServer.listen(httpsPort, () => {
  console.log(`HTTPS сервер запущен на порту ${httpsPort}`);
});

// При запуске можно вывести список URL-адресов для каждого домена и протокола
const allUrls = Object.values(domains)
  .map(domain =>
    [paths.root, paths.examples].flatMap((route: string) =>
      [`http://${domain}:${httpPort}${route}`, `https://${domain}:${httpsPort}${route}`, '\n']
    )
  )
  .flat();

console.log('--------------------------------');
console.log(allUrls.join('\n'));
console.log('--------------------------------');
