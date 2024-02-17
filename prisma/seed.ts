import { BORROWER_BOB } from '../constants/borrower-bob';
import { BORROWER_CONTRACT_ADDRESS } from '../constants/supported-nft-contracts';

import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient();

const listingData: Prisma.ListingCreateInput[] = [
  {
    nftContractAddress: BORROWER_CONTRACT_ADDRESS,
    nftTokenId: 0,
    nftOwner: BORROWER_BOB
  },
  {
    nftContractAddress: BORROWER_CONTRACT_ADDRESS,
    nftTokenId: 1,
    nftOwner: BORROWER_BOB
  }
];


const bidData: Prisma.BidCreateInput[] = [
  {
    bidder: '0x281f0d74Fa356C17E36603995e0f50D298d4a5A9', // alice
    amount: 50,
    repayAmount: 60,
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // 2 days
  }
];


async function main() {
  console.log(`Start seeding ...`)
  await prisma.listing.deleteMany({});
  await prisma.bid.deleteMany({});
  const listingIds = [];

  for (const l of listingData) {
    const listing = await prisma.listing.create({
      data: l,
    });
    console.log(`Created listing with id: ${listing.id}`);
    listingIds.push(listing.id);
  }

  for (const b of bidData) {
    const bid = await prisma.bid.create({
      data: {
        ...b,
        listing: {
          connect: {
            id: listingIds[0],
          },
        },
      },
    });
    console.log(`Created bid with id: ${bid.id}`);
    const afterUpdate = await prisma.bid.update({
      where: {id: bid.id},
      data: {listingId: listingIds[0]}
    })
    console.log(`Updated bid with id: ${bid.id} to be ${JSON.stringify(afterUpdate)}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })