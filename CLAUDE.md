# Admin Panel Template

**Codex:** `~/Codex/standards/` — система стандартов качества

---

## Pipeline

```
Локально → git push → CI (lint + build) → Production
```

**Правила (без исключений):**
1. Код попадает на сервер ТОЛЬКО через git push → CI
2. Перед коммитом: lint — всё зелёное
3. Коммиты: conventional (`feat:`, `fix:`, `refactor:`, `chore:`)
4. Secrets — только в `.env` / GitHub Secrets
5. CI красный → не мержим

## Стек

React 19 + TypeScript 5.9 + Vite 7 + Zustand + Tailwind + shadcn/ui + React Query + React Hook Form + Zod

## Команды

```bash
npm run dev      # vite dev server
npm run lint     # eslint (0 errors required)
npm run build    # tsc + vite build (must pass)
```

## Перед написанием кода

1. Определи стек → `/codex`
2. Пиши код → следуя стандартам (react.md, typescript.md)
3. 20% сессии → улучшение качества
