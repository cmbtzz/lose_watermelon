# 龟神 AI

一个可部署到 Linux + Nginx 的 Vue 3 私人 AI 聊天网页。前端使用 TypeScript、Composition API、Element Plus、markdown-it 与 highlight.js。

## 当前 AstrBot 检测结果

- AstrBot detected: **no**（仅针对当前 Windows 构建环境）
- Docker: 未安装
- Nginx: 未安装
- Node.js: 25.2.1
- npm: 11.6.2

当前未检测到 AstrBot，需要在实际 Linux 服务器上确认安装版本及真实 API 后才能启用真实 AI。项目默认使用 Mock 模式；`AstrBotAdapter` 不包含任何猜测的端点、鉴权或流协议。

## 本地运行

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
```

构建产物位于 `dist/`。

## 已实现

- 新建、切换和删除会话
- localStorage 历史记录
- Markdown、列表、表格、引用、行内代码与代码高亮
- Mock 流式回复与停止生成
- 用户在底部时自动跟随；主动上翻时不抢滚动位置
- Enter 发送、Shift + Enter 换行
- 429、连接失败、服务器错误和 AstrBot 不可用提示
- 深浅主题、PC / 平板 / 手机响应式布局和移动端 Drawer
- 可替换的 `ChatService` 适配层
- Nginx SPA、限流、请求大小、长连接和 SSE 防缓存示例

## 配置

复制 `.env.example` 为 `.env`。默认保留 `VITE_CHAT_PROVIDER=mock`。只有在服务器端实测 AstrBot API 并完成 `src/services/chat/astrbotAdapter.ts` 后，才改为 `astrbot`。

所有 `VITE_` 变量都会进入浏览器，绝对不要放 Gemini Key 或 AstrBot Token。分享图目前使用站内路径 `/og.png`；知道正式域名后，应把 `index.html` 中的 Open Graph / Twitter 图片地址改为完整 HTTPS 地址。

详细服务器步骤见 `deploy/README.md`。
