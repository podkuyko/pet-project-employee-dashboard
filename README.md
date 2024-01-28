# Инструкция по запуску

1. запускам postgres через докер
   `docker run --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=postgres -d postgres`
2. Устанавливаем зависимости проекта
   `npm i`
3. Запускаем сервак
   `npm run start:dev`

Ссылка на swagger - <http://localhost:3000/swagger>