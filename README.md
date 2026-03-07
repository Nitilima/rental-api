# Comandos Prisma

## Migrations

```bash
# Criar e aplicar uma nova migration (desenvolvimento)
npx prisma migrate dev --name nome-da-migration *

# Aplicar migrations pendentes (produção)
npx prisma migrate deploy

# Ver status das migrations
npx prisma migrate status

# Resetar o banco e reaplicar todas as migrations
npx prisma migrate reset
```

## Client

```bash
# Gerar o Prisma Client após alterar o schema
npx prisma generate *
```

## Banco de dados

```bash
# Abrir o Prisma Studio (interface visual do banco)
npx prisma studio

# Puxar o schema a partir de um banco existente
npx prisma db pull

# Aplicar o schema direto no banco sem criar migration
npx prisma db push
```
