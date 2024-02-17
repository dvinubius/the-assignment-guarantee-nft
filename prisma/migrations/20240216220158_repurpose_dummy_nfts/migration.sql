-- CreateTable
CREATE TABLE "Bid" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "amount" INTEGER NOT NULL,
    "repayAmount" INTEGER NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "nftContractAddress" VARCHAR(255) NOT NULL,
    "nftTokenId" INTEGER NOT NULL,
    "accepted" BOOLEAN NOT NULL DEFAULT false,
    "bidder" VARCHAR(255) NOT NULL,

    CONSTRAINT "Bid_pkey" PRIMARY KEY ("id")
);
