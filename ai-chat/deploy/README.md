# Linux / Nginx 部署

1. 在构建机运行 `npm install` 和 `npm run build`。
2. 把 `dist/` 上传到服务器，例如 `/var/www/guishen-ai/dist`。
3. 复制 `nginx.conf.example`，修改域名、静态目录和已验证的内部服务端口。
4. 运行 `nginx -t`，通过后再重载 Nginx。
5. 域名解析生效后，用 Certbot 配置 HTTPS。

安全组只开放 80、443；22 最好仅允许可信 IP。AstrBot、数据库、Redis、Docker API 和内部代理端口不要公网开放。AstrBot 或代理层应只监听 `127.0.0.1`。

## AstrBot 上线前检查

在服务器检查目录、Docker 容器、进程、监听端口、版本、配置、已注册路由及 OpenAPI/Swagger。以当前安装版本为准，确认 HTTP Method、路径、鉴权、请求体、会话字段、SSE/WebSocket 事件与结束标志后，再实现 `src/services/chat/astrbotAdapter.ts`。

若 Token 不能安全地由 Nginx 注入，使用薄代理层保存 Token。Gemini Key 永远留在 AstrBot 服务器端。
