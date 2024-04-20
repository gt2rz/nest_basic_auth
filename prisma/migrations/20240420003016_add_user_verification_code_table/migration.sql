-- CreateTable
CREATE TABLE "UserVerificationCodes" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserVerificationCodes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserVerificationCodes_userId_key" ON "UserVerificationCodes"("userId");

-- AddForeignKey
ALTER TABLE "UserVerificationCodes" ADD CONSTRAINT "UserVerificationCodes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
