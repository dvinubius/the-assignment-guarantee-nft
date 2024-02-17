import { Prisma } from "@prisma/client"
import { Nft } from "./nft"

const listingWithBids = Prisma.validator<Prisma.ListingDefaultArgs>()({
  include: { bids: true },
})

export type ListingWithBids = Prisma.ListingGetPayload<typeof listingWithBids>

export type FullListing = ListingWithBids & {
  nft: Nft
}