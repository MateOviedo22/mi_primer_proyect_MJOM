import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import * as bcrypt from "bcryptjs";

const adapter = new PrismaBetterSqlite3({
  url: "file:./dev.db",
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const password = await bcrypt.hash("123456", 10);

  const tenant = await prisma.tenant.create({
    data: {
      name: "Tenant Principal",
    },
  });

  await prisma.user.create({
    data: {
      name: "Usuario Administrador",
      email: "admin@example.com",
      password,
      tenantId: tenant.id,
    },
  });

  console.log("Datos iniciales creados correctamente.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });