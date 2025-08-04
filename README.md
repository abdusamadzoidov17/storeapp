# Интернет-магазин на Next.js

Полнофункциональный интернет-магазин с админ-панелью, построенный на Next.js 15, TypeScript, Prisma и Tailwind CSS.

## 🚀 Развертывание на хостинге

### 1. Требования к хостингу

- Node.js 18+ 
- NPM/Yarn
- Поддержка SQLite (или другая база данных)
- SSH доступ

### 2. Подготовка к развертыванию

#### Копирование файлов на сервер
```bash
# Скопируйте все файлы проекта на сервер
scp -r ./ user@your-server:/path/to/project/
```

#### Настройка переменных окружения
Создайте файл `.env.production` на сервере:
```bash
DATABASE_URL=file:./db/custom.db
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-super-secret-key-here
NODE_ENV=production
```

### 3. Варианты развертывания

#### Вариант 1: Развертывание на VPS/Выделенном сервере

1. **Подключитесь к серверу**
```bash
ssh user@your-server
cd /path/to/project
```

2. **Установите зависимости**
```bash
npm install --production
```

3. **Соберите проект**
```bash
npm run build
```

4. **Настройте базу данных**
```bash
npm run db:generate
npm run db:seed
```

5. **Запустите приложение**
```bash
npm start
```

#### Вариант 2: Использование PM2 для продакшена

1. **Установите PM2**
```bash
npm install -g pm2
```

2. **Создайте ecosystem.config.js**
```javascript
module.exports = {
  apps: [{
    name: 'ecommerce-store',
    script: 'tsx',
    args: 'server.ts',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
}
```

3. **Запустите приложение через PM2**
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### Вариант 3: Развертывание на платформах (Vercel, Netlify, Railway)

##### Vercel
1. **Установите Vercel CLI**
```bash
npm install -g vercel
```

2. **Разверните проект**
```bash
vercel --prod
```

##### Railway
1. **Установите Railway CLI**
```bash
npm install -g @railway/cli
```

2. **Войдите в Railway**
```bash
railway login
```

3. **Инициализируйте проект**
```bash
railway init
```

4. **Разверните проект**
```bash
railway up
```

### 4. Настройка Nginx (опционально)

Если вы используете VPS, настройте Nginx как обратный прокси:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /path/to/your/cert.pem;
    ssl_certificate_key /path/to/your/key.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    location /socket.io/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 5. Настройка SSL сертификата (Let's Encrypt)

```bash
# Установите Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Получите сертификат
sudo certbot --nginx -d your-domain.com

# Автоматическое обновление
sudo crontab -e
# Добавьте строку:
0 12 * * * /usr/bin/certbot renew --quiet
```

### 6. Мониторинг и логирование

#### Настройка логирования
```bash
# Создайте директорию для логов
mkdir -p logs

# Настройте ротацию логов
sudo nano /etc/logrotate.d/ecommerce-store
```

Добавьте в файл:
```
/path/to/project/logs/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 644 nodejs nodejs
}
```

### 7. Обновление приложения

Для обновления приложения на продакшене:

```bash
# 1. Подключитесь к серверу
ssh user@your-server

# 2. Перейдите в директорию проекта
cd /path/to/project

# 3. Получите последние изменения
git pull origin main

# 4. Установите зависимости
npm install --production

# 5. Соберите проект
npm run build

# 6. Обновите базу данных
npm run db:generate

# 7. Перезапустите приложение
pm2 restart ecommerce-store
```

## 🔧 Troubleshooting

### Общие проблемы

1. **Ошибка сборки**
   - Проверьте версию Node.js (должна быть 18+)
   - Убедитесь, что все зависимости установлены
   - Проверьте переменные окружения

2. **Ошибка базы данных**
   - Убедитесь, что файл базы данных существует
   - Проверьте права доступа к директории db
   - Запустите `npm run db:generate`

3. **Ошибка аутентификации**
   - Проверьте NEXTAUTH_URL и NEXTAUTH_SECRET
   - Убедитесь, что домен правильно настроен

### Полезные команды

```bash
# Проверка статуса PM2
pm2 status

# Просмотр логов
pm2 logs ecommerce-store

# Перезапуск приложения
pm2 restart ecommerce-store

# Остановка приложения
pm2 stop ecommerce-store

# Удаление приложения
pm2 delete ecommerce-store
```

## 📞 Поддержка

Если у вас возникли проблемы с развертыванием, проверьте:
1. Логи приложения
2. Конфигурацию сервера
3. Переменные окружения
4. Версии Node.js и NPM