-- CreateTable
CREATE TABLE "StartupJourney" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currentStage" TEXT NOT NULL DEFAULT 'idea',
    "stageProgress" INTEGER NOT NULL DEFAULT 0,
    "ideaStageCompleted" BOOLEAN NOT NULL DEFAULT false,
    "validationStageCompleted" BOOLEAN NOT NULL DEFAULT false,
    "prototypeStageCompleted" BOOLEAN NOT NULL DEFAULT false,
    "launchStageCompleted" BOOLEAN NOT NULL DEFAULT false,
    "growthStageCompleted" BOOLEAN NOT NULL DEFAULT false,
    "unlockedTools" TEXT NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StartupJourney_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FounderScore" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalScore" INTEGER NOT NULL DEFAULT 0,
    "skillLevel" TEXT NOT NULL DEFAULT 'novice',
    "ideasGenerated" INTEGER NOT NULL DEFAULT 0,
    "validationReports" INTEGER NOT NULL DEFAULT 0,
    "customerInterviews" INTEGER NOT NULL DEFAULT 0,
    "sprintTasksCompleted" INTEGER NOT NULL DEFAULT 0,
    "prototypesLaunched" INTEGER NOT NULL DEFAULT 0,
    "achievements" TEXT NOT NULL DEFAULT '[]',
    "badges" TEXT NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FounderScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExecutionStreak" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "lastActivityDate" TIMESTAMP(3),
    "streakHistory" TEXT NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExecutionStreak_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerInterview" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startupIdeaId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerRole" TEXT,
    "customerCompany" TEXT,
    "interviewDate" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER,
    "problemsIdentified" TEXT,
    "feedbackNotes" TEXT,
    "keyInsights" TEXT,
    "validationScore" INTEGER,
    "confidenceLevel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerInterview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrototypePlan" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startupIdeaId" TEXT NOT NULL,
    "platformType" TEXT NOT NULL,
    "mvpFeatures" TEXT NOT NULL,
    "featurePriority" TEXT NOT NULL,
    "developmentStages" TEXT NOT NULL,
    "estimatedTimeline" TEXT,
    "skillsNeeded" TEXT,
    "toolsNeeded" TEXT,
    "estimatedBudget" DECIMAL(10,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrototypePlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StartupMetrics" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startupIdeaId" TEXT NOT NULL,
    "totalUsers" INTEGER NOT NULL DEFAULT 0,
    "activeUsers" INTEGER NOT NULL DEFAULT 0,
    "monthlyRecurringRevenue" DECIMAL(10,2),
    "churnRate" DECIMAL(5,2),
    "nps" INTEGER,
    "customerSatisfaction" INTEGER,
    "feedbackCount" INTEGER NOT NULL DEFAULT 0,
    "growthRate" DECIMAL(5,2),
    "conversionRate" DECIMAL(5,2),
    "metricsHistory" TEXT NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StartupMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PitchDeck" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startupIdeaId" TEXT NOT NULL,
    "problem" TEXT,
    "solution" TEXT,
    "marketSize" TEXT,
    "product" TEXT,
    "businessModel" TEXT,
    "competition" TEXT,
    "traction" TEXT,
    "vision" TEXT,
    "title" TEXT,
    "subtitle" TEXT,
    "pdfUrl" TEXT,
    "presentationUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PitchDeck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyMission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "weekStartDate" TIMESTAMP(3) NOT NULL,
    "weekEndDate" TIMESTAMP(3) NOT NULL,
    "missions" TEXT NOT NULL DEFAULT '[]',
    "completedMissions" TEXT NOT NULL DEFAULT '[]',
    "pointsEarned" INTEGER NOT NULL DEFAULT 0,
    "completionPercentage" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeeklyMission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeaderboardEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "founderScore" INTEGER NOT NULL DEFAULT 0,
    "executionStreak" INTEGER NOT NULL DEFAULT 0,
    "projectsCompleted" INTEGER NOT NULL DEFAULT 0,
    "overallRank" INTEGER,
    "scoreRank" INTEGER,
    "streakRank" INTEGER,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeaderboardEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningModule" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "videoUrl" TEXT,
    "resources" TEXT,
    "difficulty" TEXT NOT NULL,
    "estimatedTime" INTEGER,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearningModule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "progress" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearningProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestorReadiness" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startupIdeaId" TEXT NOT NULL,
    "validationScore" INTEGER NOT NULL DEFAULT 0,
    "prototypeScore" INTEGER NOT NULL DEFAULT 0,
    "tractionScore" INTEGER NOT NULL DEFAULT 0,
    "businessModelScore" INTEGER NOT NULL DEFAULT 0,
    "teamScore" INTEGER NOT NULL DEFAULT 0,
    "overallReadiness" INTEGER NOT NULL DEFAULT 0,
    "readinessLevel" TEXT NOT NULL DEFAULT 'not-ready',
    "recommendations" TEXT NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvestorReadiness_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StartupJourney_userId_key" ON "StartupJourney"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "FounderScore_userId_key" ON "FounderScore"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ExecutionStreak_userId_key" ON "ExecutionStreak"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PrototypePlan_startupIdeaId_key" ON "PrototypePlan"("startupIdeaId");

-- CreateIndex
CREATE UNIQUE INDEX "StartupMetrics_startupIdeaId_key" ON "StartupMetrics"("startupIdeaId");

-- CreateIndex
CREATE UNIQUE INDEX "PitchDeck_startupIdeaId_key" ON "PitchDeck"("startupIdeaId");

-- CreateIndex
CREATE UNIQUE INDEX "LeaderboardEntry_userId_key" ON "LeaderboardEntry"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "InvestorReadiness_startupIdeaId_key" ON "InvestorReadiness"("startupIdeaId");

-- AddForeignKey
ALTER TABLE "StartupJourney" ADD CONSTRAINT "StartupJourney_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FounderScore" ADD CONSTRAINT "FounderScore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExecutionStreak" ADD CONSTRAINT "ExecutionStreak_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerInterview" ADD CONSTRAINT "CustomerInterview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerInterview" ADD CONSTRAINT "CustomerInterview_startupIdeaId_fkey" FOREIGN KEY ("startupIdeaId") REFERENCES "StartupIdea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrototypePlan" ADD CONSTRAINT "PrototypePlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrototypePlan" ADD CONSTRAINT "PrototypePlan_startupIdeaId_fkey" FOREIGN KEY ("startupIdeaId") REFERENCES "StartupIdea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StartupMetrics" ADD CONSTRAINT "StartupMetrics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StartupMetrics" ADD CONSTRAINT "StartupMetrics_startupIdeaId_fkey" FOREIGN KEY ("startupIdeaId") REFERENCES "StartupIdea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PitchDeck" ADD CONSTRAINT "PitchDeck_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PitchDeck" ADD CONSTRAINT "PitchDeck_startupIdeaId_fkey" FOREIGN KEY ("startupIdeaId") REFERENCES "StartupIdea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyMission" ADD CONSTRAINT "WeeklyMission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaderboardEntry" ADD CONSTRAINT "LeaderboardEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningProgress" ADD CONSTRAINT "LearningProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningProgress" ADD CONSTRAINT "LearningProgress_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "LearningModule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestorReadiness" ADD CONSTRAINT "InvestorReadiness_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestorReadiness" ADD CONSTRAINT "InvestorReadiness_startupIdeaId_fkey" FOREIGN KEY ("startupIdeaId") REFERENCES "StartupIdea"("id") ON DELETE CASCADE ON UPDATE CASCADE;
