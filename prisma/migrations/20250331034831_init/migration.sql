-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "user";

-- CreateTable
CREATE TABLE "user"."User" (
    "userId" TEXT NOT NULL,
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "password" TEXT NOT NULL,
    "country" VARCHAR(50) NOT NULL,
    "gender" VARCHAR(50) NOT NULL,
    "city" VARCHAR(50) NOT NULL,
    "phone" VARCHAR(50) NOT NULL,
    "userStatusId" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "user"."UserStatus" (
    "userStatusId" TEXT NOT NULL,
    "status" VARCHAR(50) NOT NULL,

    CONSTRAINT "UserStatus_pkey" PRIMARY KEY ("userStatusId")
);

-- CreateTable
CREATE TABLE "user"."MultifactorMethods" (
    "supportedMethodId" TEXT NOT NULL,
    "method" VARCHAR(50) NOT NULL,
    "active" BOOLEAN NOT NULL,

    CONSTRAINT "MultifactorMethods_pkey" PRIMARY KEY ("supportedMethodId")
);

-- CreateTable
CREATE TABLE "user"."MultifactorMethod" (
    "multifactorMethodId" TEXT NOT NULL,
    "contact" VARCHAR(50) NOT NULL,
    "active" BOOLEAN NOT NULL,
    "supportedMethodId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lastTimeUsed" TIMESTAMP(3) NOT NULL,
    "statusId" TEXT NOT NULL,

    CONSTRAINT "MultifactorMethod_pkey" PRIMARY KEY ("multifactorMethodId")
);

-- CreateTable
CREATE TABLE "user"."MultifactorStatus" (
    "multifactorStatusId" TEXT NOT NULL,
    "status" VARCHAR(50) NOT NULL,

    CONSTRAINT "MultifactorStatus_pkey" PRIMARY KEY ("multifactorStatusId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "user"."User"("email");

-- AddForeignKey
ALTER TABLE "user"."User" ADD CONSTRAINT "User_userStatusId_fkey" FOREIGN KEY ("userStatusId") REFERENCES "user"."UserStatus"("userStatusId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user"."MultifactorMethod" ADD CONSTRAINT "MultifactorMethod_supportedMethodId_fkey" FOREIGN KEY ("supportedMethodId") REFERENCES "user"."MultifactorMethods"("supportedMethodId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user"."MultifactorMethod" ADD CONSTRAINT "MultifactorMethod_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"."User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user"."MultifactorMethod" ADD CONSTRAINT "MultifactorMethod_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "user"."MultifactorStatus"("multifactorStatusId") ON DELETE RESTRICT ON UPDATE CASCADE;
