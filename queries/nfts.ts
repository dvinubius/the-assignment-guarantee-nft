import { SUPPORTED_NFT_CONTRACTS } from "@/constants/supported-nft-contracts";
import prisma from "@/lib/prisma";
import { Nft } from "@/types/nft";
import { Bid } from "@prisma/client";

const METADATA_URL = 'https://dummynfts.vercel.app/api/token';
const OPENSEA_URL = 'https://testnets.opensea.io/assets/sepolia';

export const getBorrowerNfts = async (contractAddress: string, ownerAddress: string): Promise<Nft[]> => {
  // TODO fetch NFTs from the contract instead of this mock data

  const tokenMetadataRes = await Promise.all(
    Array.from(new Array(10).keys()).map(
      (key: number) => fetch(`${METADATA_URL}/${key}`)
    )
  );
  const tokenMetadata = await Promise.all(
    tokenMetadataRes.map((res) => res.json())
  );
  return tokenMetadata.map(
        (token: { name: string; description: string; image: string; external_url: string; }, idx: number) => ({
          contractAddress,
          tokenId: idx,
          collectionName: 'DummyNFT',
          symbol: 'DNFT',
          name: token.name,
          description: token.description,
          image: token.image,
          external_url: token.external_url,
          openSeaLink: `${OPENSEA_URL}/${contractAddress}/${idx}`,
          collateralized: false,
          bids: [] as Bid[],
        })
  );
}

const NftsForListing = async (userAddress: string, contractAddress: string) => {
  const nfts = await getBorrowerNfts(contractAddress, userAddress);
  
  const listings = await prisma.listing.findMany({
    include: { bids: true },
  });
  
  for (const listing of listings) {
    const nft = nfts.find((nft) => nft.tokenId === listing.nftTokenId);
    if (nft) {
      nft.bids = listing.bids;
      nft.listingId = listing.id;
      if (nft.bids.some(bid => bid.accepted)) {
        nft.collateralized = true;
      }
    }
  }
  
  return nfts.filter(nft => !nft.collateralized);
}


// NFTs for Bob to list or accept bids on
export const getBorrowerNftsForListing = async (userAddress: string) => {
  const allNfts = [];
  for (const contractAddress of SUPPORTED_NFT_CONTRACTS) {
    const nfts = await NftsForListing(userAddress, contractAddress);
    allNfts.push(...nfts);
  }
  return allNfts;
}
