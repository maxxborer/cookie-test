# cookie-test

## Подготовка окружения

В вашем hosts-файле (на Windows: C:\Windows\System32\drivers\etc\hosts; на Mac/Linux: /etc/hosts) добавьте следующие строки:

```lua
127.0.0.1   test.local
127.0.0.1   sub.test.local
```

## Подготовка проекта

```shell
yarn # ставим зависимости
yarn start # запускаем
```

После запуска в терминале будут ссылки для открытия.

Нажимайте на кнопки для тестов и наблюдайте за выводом document.cookie (на экране отобразится текущее значение cookie) или прямо в DevTools.
