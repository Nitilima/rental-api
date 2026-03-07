/*
  Warnings:

  - A unique constraint covering the columns `[keycloak_id]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "keycloak_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Customer_keycloak_id_key" ON "Customer"("keycloak_id");
