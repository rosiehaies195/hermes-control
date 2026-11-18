# Hermes control

Telegram Mini App: панель управления агентами Hermes (сейчас Claude Desktop, позже Codex).
Статическая страница: состояние приходит в URL-хеше (`#z=` — deflate-raw + base64url) или с локального API (`#api=`),
действия уходят боту через `Telegram.WebApp.sendData` (или `POST /api`).

Логотипы Claude и Codex — из @lobehub/icons (товарные знаки принадлежат владельцам), портрет Hermes — из hermes-agent.
