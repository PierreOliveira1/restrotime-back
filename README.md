# RESTROTIME API

## RUN

- Start mongodb
```bash
docker-compose up
```

- Install dependencies

```bash
pnpm install
```

- Copy .env.example to .env

```bash
cp .env.example .env
```

- Generate prisma client

```bash
pnpm prisma generate
```

- Push prisma schema to database

```bash
pnpm prisma db push
```

- Start server

```bash
pnpm dev
```
