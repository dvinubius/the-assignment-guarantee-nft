import NftCard from '@/components/NftCard';
import { getListingsForLender } from '@/queries/listings';
import { FullListing } from '@/types/listing';
import React from 'react'

async function LenderListings() {
  // DB (+ Blockchain) query
  const listings: FullListing[] = await getListingsForLender();

  // just to display INFURA loading state
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return (
    <div className='w-full'>
      <div className='max-h-[75vh] flex flex-wrap justify-center overflow-y-auto gap-8 pb-16'>
        {listings?.map((listing) => (
          <NftCard key={listing.nft.name} nft={listing.nft} forBorrower={false}/>
        ))}
      </div>
    </div>
  )
}

export default LenderListings