# LLM Models — рекомендации по выбору моделей для агентов

> CAP-013: Оптимизация моделей агентов — подбор лёгких LLM (videlboga, 2026-06-08)

Этот документ фиксирует матрицу «модель ↔ роль агента» для компании videlboga и инструкцию по обновлению через Paperclip API. Все модели доступны через провайдер `ollama-cloud` (`https://ollama.com/v1`).

## Зачем

`model.default` в `config.yaml` — `deepseek-v4-flash`. Это большая flash-модель (длинный контекст, много параметров), которая расходует много токенов compute-quota Ollama. Для рутинных задач (heartbeat-пробуждение PM, простые проверки QA) она избыточна — нужна более лёгкая модель.

Лёгкие модели (3B–14B params) дают:
- в 3–10× меньше compute на inference
- сопоставимое качество на простых задачах
- меньше latency (быстрее отклик агента)

## Провайдеры

| Provider | Где живёт | Когда использовать |
|---|---|---|
| `ollama-cloud` | `https://ollama.com/v1` | Основной. Все модели ниже доступны здесь. |
| `ollama-launch` | `http://127.0.0.1:11434/v1` | Локальный Ollama. По умолчанию `nemotron-3-super:cloud`. |
| `openrouter` | fallback | Если ollama-cloud недоступен. |

**Copilot CLI** (`/usr/bin/copilot`) используется **только** как ACP-агент в `delegate_task` (см. `agent/copilot_acp_client.py`). Это **не LLM-провайдер** для агентов Paperclip — модели через него не выбираются.

## Доступные лёгкие модели (ollama-cloud, июнь 2026)

Полный список — `GET https://ollama.com/v1/models` (41 модель). Ниже — лёгкие кандидаты:

| Модель | Парам | Контекст | Modalities | Назначение |
|---|---|---|---|---|
| `ministral-3:3b` | 3B | 262K | text+image | **Самая лёгкая**. Heartbeat / простые команды. |
| `gemma3:4b` | 4B | 131K | text+image | Лёгкая альтернатива с vision. |
| `ministral-3:8b` | 8B | 262K | text+image | **Средне-лёгкая**. QA, рутинные проверки. |
| `rnj-1:8b` | 8B | 32K | text | Только текст, очень маленький контекст. |
| `ministral-3:14b` | 14B | 262K | text+image | Кодинг, чуть тяжелее 8b. |
| `gpt-oss:20b` | 20B | 131K | text | Open-source, хорош для reasoning. |
| `qwen3-coder-next` | ~80B | 262K | text | Быстрая qwen для кода. |
| `deepseek-v4-flash` | flash | 1M | text | **Default**. Большой контекст, средняя скорость. |
| `gemini-3-flash-preview` | flash | 1M | text+image | Альтернатива flash с vision. |
| `minimax-m3` | mid | 512K | text+image+video | Текущая модель Engineer. Vision + video. |

**Цена:** все advertised как $0/M tokens на ollama-cloud, но реальный «compute-кредит» Ollama расходуется по params. Меньше params → меньше расход квоты.

## Рекомендованная матрица (videlboga, июнь 2026)

| Агент | Роль | Было | Стало | Почему |
|---|---|---|---|---|
| **PM** (4a80f388) | heartbeat, рутина | default=`deepseek-v4-flash` | `ministral-3:3b` | PM делает 1500+ heartbeat-тиков в месяц. 3B модель радикально снижает расход, а качество достаточно для текстовых команд. |
| **QA Engineer** (7cf5c141) | review, проверки | `minimax-m3` | `ministral-3:8b` | QA в основном читает код/логи, проверяет статус. 8B — запас качества для аналитики. |
| **Engineer** (b45a5df1) | код, SSH, PR | `minimax-m3` | `minimax-m3` (без изменений) | Инженер пишет код и длинные цепочки действий — нужна модель с vision и длинным контекстом. |
| **DevOps** (1697b055) | деплой, ssh | default=`deepseek-v4-flash` | `ministral-3:8b` | DevOps в основном простые команды SSH/systemctl. 8B хватает. |
| **Researcher** (bd3f4ca3) | ресёрч, чтение | default=`deepseek-v4-flash` | `minimax-m3` | Researcher читает длинные арт-факты и анализирует — нужна более сильная модель с большим контекстом. Апгрейд с дефолта. |

**Итог по расходу:** PM уходит с 1M-контекст flash на 3B, DevOps — со flash на 8B. Engineer и Researcher остаются на своих моделях, QA переходит с `minimax-m3` (mid) на `ministral-3:8b` (8B).

## Как обновить модель агента

Per-agent конфиг хранится в `adapterConfig` записи агента в БД Paperclip. Адаптер `hermes-paperclip-adapter/execute.js:270-271` читает `adapterConfig.model` и `adapterConfig.provider` и пробрасывает в `hermes chat -m <model> --provider <provider>`.

### Через Paperclip API (рекомендуется)

```python
import json, http.client

with open('/root/.hermes/.env') as f:
    env = {k:v for k,v in (l.strip().split('=',1) for l in f if '=' in l and not l.startswith('#'))}

KEY = env['PAPERCLIP_API_KEY']
RUN_ID = env['PAPERCLIP_RUN_ID']
HOST, PORT = "127.0.0.1", 3100

# PATCH only adapterConfig (full-body PATCH ломает permissions validation → 400)
payload = {
    "adapterConfig": {
        "model": "ministral-3:3b",
        "provider": "ollama-cloud",
        "timeoutSec": 1800
    }
}

conn = http.client.HTTPConnection(HOST, PORT, timeout=15)
conn.request("PATCH", "/api/agents/<AGENT_ID>",
             body=json.dumps(payload).encode(),
             headers={
                 "Authorization": f"Bearer {KEY}",
                 "Content-Type": "application/json",
                 "X-Paperclip-Run-Id": RUN_ID,
             })
resp = conn.getresponse()
print(resp.status, resp.read().decode())
conn.close()
```

### Проверка

```python
# GET /api/agents/{id} — посмотреть adapterConfig.model и adapterConfig.provider
conn.request("GET", "/api/agents/<AGENT_ID>",
             headers={"Authorization": f"Bearer {KEY}"})
```

### Pitfall

- **PATCH возвращает 403 на `:3101`** — переключиться на `:3100` (fork node).
- **`status: "cancelled"`** — недопустим для агента (404). Допустимые: `active`, `paused`, `idle`, `running`, `error`, `pending_approval`, `terminated`.
- **Не передавать `assigneeAgentId:null` в одном PATCH с другими полями** — может потеряться. Сначала одно, потом другое.

## Текущая матрица (применена в июне 2026)

| Агент | ID | model | provider | timeoutSec |
|---|---|---|---|---|
| Engineer | `b45a5df1-993d-4b4a-87f7-d97d69ae7d5a` | `minimax-m3` | `ollama-cloud` | 3600 |
| QA Engineer | `7cf5c141-a9fe-4624-b86f-726c116940ba` | `ministral-3:8b` | `ollama-cloud` | 1800 |
| PM | `4a80f388-e29b-413e-bc73-9f94fa30c602` | `ministral-3:3b` | `ollama-cloud` | 1800 |
| DevOps | `1697b055-e7a2-48d1-9c87-2a5cb4e251ea` | `ministral-3:8b` | `ollama-cloud` | 1800 |
| Researcher | `bd3f4ca3-fc5b-491f-9ab3-2a9d26b4372d` | `minimax-m3` | `ollama-cloud` | 3600 |

## См. также

- `docs/agents-runtime.md` — как работает Hermes adapter runtime
- `docs/adapters/` — детали адаптеров
- `/home/paperclip/paperclip/server/src/services/heartbeat.ts:7214` — где пробрасывается `adapterConfig` в `hermes chat` (см. также `hermes-paperclip-adapter/dist/server/execute.js:120`)
