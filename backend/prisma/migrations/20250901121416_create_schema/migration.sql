-- CreateTable
CREATE TABLE "public"."Project" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);
