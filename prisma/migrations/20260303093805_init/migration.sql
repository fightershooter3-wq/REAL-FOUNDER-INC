-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "bio" TEXT,
    "profileImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StartupIdea" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "targetAudience" TEXT,
    "problemSolved" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "marketClarityScore" INTEGER,
    "problemSolutionStrength" INTEGER,
    "monetizationSuggestions" TEXT,
    "riskAnalysis" TEXT,
    "competitorAwareness" TEXT,
    "tam" TEXT,
    "sam" TEXT,
    "som" TEXT,
    "demandIndicators" TEXT,
    "marketTrends" TEXT,
    "entryStrategies" TEXT,
    "businessModel" TEXT,
    "revenueStreams" TEXT,
    "costStructure" TEXT,
    "keyMetrics" TEXT,
    "executionStreak" INTEGER NOT NULL DEFAULT 0,
    "progressPercentage" INTEGER NOT NULL DEFAULT 0,
    "currentSprint" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StartupIdea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeanCanvas" (
    "id" TEXT NOT NULL,
    "startupIdeaId" TEXT NOT NULL,
    "problem" TEXT,
    "solution" TEXT,
    "uniqueValueProposition" TEXT,
    "channels" TEXT,
    "revenueStreams" TEXT,
    "costStructure" TEXT,
    "keyMetrics" TEXT,
    "unfairAdvantage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeanCanvas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessModelDesign" (
    "id" TEXT NOT NULL,
    "startupIdeaId" TEXT NOT NULL,
    "modelType" TEXT NOT NULL,
    "revenueMechanics" TEXT,
    "marginPotential" TEXT,
    "risks" TEXT,
    "scalingDifficulty" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessModelDesign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExecutionSprint" (
    "id" TEXT NOT NULL,
    "startupIdeaId" TEXT NOT NULL,
    "sprintNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "weeklyDeliverables" TEXT,
    "measurableOutcomes" TEXT,
    "progressPercentage" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExecutionSprint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SprintTask" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sprintId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SprintTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ValidationLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startupIdeaId" TEXT NOT NULL,
    "conversationSummary" TEXT NOT NULL,
    "feedback" TEXT,
    "iterationsMade" INTEGER NOT NULL DEFAULT 0,
    "validationScore" INTEGER,
    "learningLog" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ValidationLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompetitorAnalysis" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startupIdeaId" TEXT NOT NULL,
    "competitorName" TEXT NOT NULL,
    "strengths" TEXT,
    "weaknesses" TEXT,
    "differentiationMap" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompetitorAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LandingPageGeneration" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startupIdeaId" TEXT NOT NULL,
    "headline" TEXT,
    "subheadline" TEXT,
    "cta" TEXT,
    "featureBullets" TEXT,
    "valueProposition" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LandingPageGeneration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinancialProjection" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startupIdeaId" TEXT NOT NULL,
    "expectedUsers" INTEGER,
    "pricing" DECIMAL(10,2),
    "monthlyCosts" DECIMAL(10,2),
    "revenueProjection" TEXT,
    "breakEvenEstimate" TEXT,
    "runwaySimulation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinancialProjection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FounderGrowth" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "skillsLearned" TEXT,
    "booksRead" INTEGER NOT NULL DEFAULT 0,
    "experimentsRun" INTEGER NOT NULL DEFAULT 0,
    "failuresLogged" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FounderGrowth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyReflection" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "week" TIMESTAMP(3) NOT NULL,
    "wins" TEXT,
    "failures" TEXT,
    "lessons" TEXT,
    "nextActions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeeklyReflection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MentorChat" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userMessage" TEXT NOT NULL,
    "mentorResponse" TEXT NOT NULL,
    "context" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MentorChat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "LeanCanvas_startupIdeaId_key" ON "LeanCanvas"("startupIdeaId");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessModelDesign_startupIdeaId_key" ON "BusinessModelDesign"("startupIdeaId");

-- CreateIndex
CREATE UNIQUE INDEX "LandingPageGeneration_startupIdeaId_key" ON "LandingPageGeneration"("startupIdeaId");

-- CreateIndex
CREATE UNIQUE INDEX "FinancialProjection_startupIdeaId_key" ON "FinancialProjection"("startupIdeaId");

-- CreateIndex
CREATE UNIQUE INDEX "FounderGrowth_userId_key" ON "FounderGrowth"("userId");

-- AddForeignKey
ALTER TABLE "StartupIdea" ADD CONSTRAINT "StartupIdea_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeanCanvas" ADD CONSTRAINT "LeanCanvas_startupIdeaId_fkey" FOREIGN KEY ("startupIdeaId") REFERENCES "StartupIdea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessModelDesign" ADD CONSTRAINT "BusinessModelDesign_startupIdeaId_fkey" FOREIGN KEY ("startupIdeaId") REFERENCES "StartupIdea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExecutionSprint" ADD CONSTRAINT "ExecutionSprint_startupIdeaId_fkey" FOREIGN KEY ("startupIdeaId") REFERENCES "StartupIdea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SprintTask" ADD CONSTRAINT "SprintTask_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SprintTask" ADD CONSTRAINT "SprintTask_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "ExecutionSprint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ValidationLog" ADD CONSTRAINT "ValidationLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ValidationLog" ADD CONSTRAINT "ValidationLog_startupIdeaId_fkey" FOREIGN KEY ("startupIdeaId") REFERENCES "StartupIdea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitorAnalysis" ADD CONSTRAINT "CompetitorAnalysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitorAnalysis" ADD CONSTRAINT "CompetitorAnalysis_startupIdeaId_fkey" FOREIGN KEY ("startupIdeaId") REFERENCES "StartupIdea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LandingPageGeneration" ADD CONSTRAINT "LandingPageGeneration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LandingPageGeneration" ADD CONSTRAINT "LandingPageGeneration_startupIdeaId_fkey" FOREIGN KEY ("startupIdeaId") REFERENCES "StartupIdea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialProjection" ADD CONSTRAINT "FinancialProjection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialProjection" ADD CONSTRAINT "FinancialProjection_startupIdeaId_fkey" FOREIGN KEY ("startupIdeaId") REFERENCES "StartupIdea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FounderGrowth" ADD CONSTRAINT "FounderGrowth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyReflection" ADD CONSTRAINT "WeeklyReflection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorChat" ADD CONSTRAINT "MentorChat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
