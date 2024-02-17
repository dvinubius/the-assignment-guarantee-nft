import prisma from "@/lib/prisma";
import { FullListing } from "@/types/listing";
import { Listing } from "@prisma/client";
import { getBorrowerNfts } from "./nfts";
import { Nft } from "@/types/nft";
import { SUPPORTED_NFT_CONTRACTS } from "@/constants/supported-nft-contracts";


const getNftForLenderListingView = async (listing: Listing): Promise<Nft | undefined> => {
  // TODO in production, handle with data from DB (nft details), initially populated via INFURA queries
  // if current owner of the NFT is not required for the use case, Blockchain query not needed here
  const nfts = await getBorrowerNfts(listing.nftContractAddress, listing.nftOwner);
  return nfts.find((nft) => nft.tokenId === listing.nftTokenId);
}

// NFTs for Bob to list or accept bids on
export const getListingsForLender = async (): Promise<FullListing[]> => {

  const listings = await prisma.listing.findMany({
    include: { bids: true },
  });

  const fullListings: FullListing[] = [];

  for (const contractAddress of SUPPORTED_NFT_CONTRACTS) {
    const listingsFromContract = listings.filter(
      (listing) => listing.nftContractAddress === contractAddress
    );

    for (const listing of listingsFromContract) {
      const nft = await getNftForLenderListingView(listing);
      if (!nft) {
        continue;
      }

      nft.bids = listing.bids;
      nft.listingId = listing.id;
      if (nft.bids.some((bid) => bid.accepted)) {
        nft.collateralized = true;
      }
      
      fullListings.push({ ...listing, nft });
    }
  }

  return fullListings;
}
