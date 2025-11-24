-- CreateTable
CREATE TABLE "StudyProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "easeFactor" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "interval" INTEGER NOT NULL DEFAULT 0,
    "repetition" INTEGER NOT NULL DEFAULT 0,
    "dueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastReviewed" TIMESTAMP(3),
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudyProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StudyProgress_userId_idx" ON "StudyProgress"("userId");

-- CreateIndex
CREATE INDEX "StudyProgress_cardId_idx" ON "StudyProgress"("cardId");

-- CreateIndex
CREATE UNIQUE INDEX "StudyProgress_userId_cardId_key" ON "StudyProgress"("userId", "cardId");

-- AddForeignKey
ALTER TABLE "StudyProgress" ADD CONSTRAINT "StudyProgress_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
