import { Bid } from "@prisma/client";

export type Nft = {
  openSeaLink: string,
  contractAddress: string,
  collectionName: string,
  symbol: string,
  tokenId: number,
  name: string,
  description: string,
  image: string,
  listingId?: number,
  collateralized: boolean,
  bids: Bid[],
}