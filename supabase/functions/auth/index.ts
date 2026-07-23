// deno-lint-ignore no-import-prefix
// deno-lint-ignore-file
import { Hono } from 'https://deno.land/x/hono@v4.3.11/mod.ts'
import { handleLogin } from './login/login-service.ts'
import { handleRefreshToken } from "./refresh-token/refresh-token-service.ts";

// Tạo app Hono và set basePath là '/auth'
const app = new Hono().basePath('/auth')

// Route: POST /functions/v1/auth/login
app.post('/login', async (c) => {
  return await handleLogin(c.req.raw)
})

// Route: POST /functions/v1/auth/refresh-token
app.post('/refresh-token', async (c) => {
  return await handleRefreshToken(c.req.raw)
})


Deno.serve(app.fetch)