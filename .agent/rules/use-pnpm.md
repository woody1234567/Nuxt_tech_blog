---
trigger: always_on
---

# Always use pnpm (mandatory)

## Non-negotiable rule

- You MUST use **pnpm** for all Node.js package management and script execution.
- You MUST NOT use `npm`, `npx`, `yarn`, or `yarnpkg` in any command, documentation, or suggestions.

## Command mapping (auto-rewrite)

Whenever you are about to use or suggest an npm/yarn command, rewrite it to pnpm:

- `npm install` → `pnpm install`
- `npm ci` → `pnpm install --frozen-lockfile`
- `npm run <script>` → `pnpm <script>` (preferred) OR `pnpm run <script>`
- `npm test` → `pnpm test`
- `npm start` → `pnpm start`
- `npm build` → `pnpm build`
- `npm add <pkg>` / `npm install <pkg>` → `pnpm add <pkg>`
- `npm i -D <pkg>` → `pnpm add -D <pkg>`
- `npm remove <pkg>` / `npm uninstall <pkg>` → `pnpm remove <pkg>`
- `npx <cmd>` → `pnpm dlx <cmd>`

If a tool/docs require `npx`, you MUST still use `pnpm dlx` as the equivalent.
