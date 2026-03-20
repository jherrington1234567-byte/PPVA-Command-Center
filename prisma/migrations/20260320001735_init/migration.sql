-- CreateTable
CREATE TABLE "Deal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "policyOwner" TEXT NOT NULL DEFAULT '',
    "policyIssueDate" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "totalDeposit" REAL NOT NULL,
    "inputsJson" TEXT NOT NULL,
    "resultsJson" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Deal_status_idx" ON "Deal"("status");

-- CreateIndex
CREATE INDEX "Deal_createdAt_idx" ON "Deal"("createdAt");
