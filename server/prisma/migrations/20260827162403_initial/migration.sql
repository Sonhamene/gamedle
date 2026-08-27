-- CreateTable
CREATE TABLE "Game" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "normalizedTitle" TEXT NOT NULL,
    "aliases" TEXT NOT NULL DEFAULT '',
    "releaseYear" INTEGER,
    "developer" TEXT,
    "publisher" TEXT,
    "description" TEXT,
    "platforms" TEXT NOT NULL DEFAULT '',
    "genres" TEXT NOT NULL DEFAULT '',
    "difficulty" TEXT NOT NULL DEFAULT 'normal',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDailyEligible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Hint" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "gameId" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    CONSTRAINT "Hint_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Game_normalizedTitle_key" ON "Game"("normalizedTitle");

-- CreateIndex
CREATE UNIQUE INDEX "Hint_gameId_position_key" ON "Hint"("gameId", "position");
