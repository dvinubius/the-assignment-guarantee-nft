import NftCard from '@/components/NftCard';
import { BORROWER_BOB } from '@/constants/borrower-bob';
import { getBorrowerNftsForListing } from '@/queries/nfts';
import React from 'react'

async function BorrowerListings() {
  
  // In order to keep this server side:
  // USER WOULD BE AUTHENTICATED VIA A SESSION DERIVED FROM LOGIN W/ METAMASK, REQUIRES SETUP 
  // using just bob for now (page only works for this particular borrower for PoC purposes)
  const userAddress = BORROWER_BOB;


  // const availableNFTs = await // TODO demonstrate how to get from INFURA API (depending on smart contract implementation)
  // Make use of Matamask SDK

  //  1. Simple case: get all NFTs owned by connected user from a ERC721Enumerable (like DummyNft.sol)


  /** 2. Complex case: get all NFTs owned by connected user from a regular ERC721 
   * 
   * Approach A:
     Demonstrate logic for a basic PoC indexing mechanism that custoomer would implement on their own backend
    --> A preliminary backend process would scan history for each supported NFT collection
        - find out all tokenIds ever minted based on Transfer events with zero address as "from", 
        - check current owner of each tokenId
    --> A permanent backend process
         - would be listening for events from supported nft collection smart contracts (INFURA) 
        - and index the tokenIds and their metadata


      Approach B:
      Demonstrate capabilities of Infura Trace API to easier query for all tokenIds owned by connected user
   */

  // instead of BC query, use a simple mock
  const availableNFTs = await getBorrowerNftsForListing(userAddress);

  // just to display INFURA loading state
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return (
    <div className='w-full'>
      <div className='max-h-[75vh] flex flex-wrap justify-center overflow-y-auto gap-8 pb-16'>
        {availableNFTs?.map((nft) => (
          <NftCard key={nft.name} nft={nft} forBorrower={true}/>
        ))}
      </div>
    </div>
  )
}

export default BorrowerListings