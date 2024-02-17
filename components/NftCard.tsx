'use client'

import React from 'react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SiOpensea } from 'react-icons/si'
import { Nft } from '@/types/nft'
import Link from 'next/link'
import { useToast } from "@/components/ui/use-toast"

import { LENDER_ALICE } from '@/constants/lender-alice'
import { BORROWER_BOB } from '@/constants/borrower-bob'
import BidButton from './BidButton'

// TODO generalize via props / MetaMaskProider query: right now component assumes borrower is BOB and bidder is ALICE
function NftCard({nft, forBorrower}: {nft: Nft, forBorrower: boolean}) {
  const cardClassName = (nft.listingId && forBorrower || nft.bids.length > 0 && !forBorrower) ? 'bg-gray-100' : 'bg-white'
  return (
    <Card className={`w-[280px] h-[330px] ${cardClassName}`}>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle>{nft.name}</CardTitle>
          <Button variant="link">
            <Link href={nft.openSeaLink} target="_blank" className='flex items-center gap-2'>
              <SiOpensea className='text-xl' /> OpenSea
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className='h-[180px]'>
        <div style={{
          backgroundImage: `url(${nft.image})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }} className='w-full h-full'></div>
      </CardContent>
      {forBorrower ? <BorrowerFooter nft={nft} /> : <LenderFooter nft={nft} />}
    </Card>
  )
}

const BorrowerFooter = ({nft}: {nft: Nft}) => {
  const { toast } = useToast();

  const handleListNft = async () => {
    const postRequest = await fetch('http://localhost:3000/api/listing', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nftTokenId: nft.tokenId,  nftOwner: BORROWER_BOB, nftContractAddress: nft.contractAddress})
    });

    if (postRequest.status === 200) {
      toast({
        title: "Nft Listed!",
        description: "Your Nft can now receive bids",
        duration: 3000,
      })
    };
  }
  return (
    <CardFooter>
      {!nft.listingId && <Button variant="outline" className='mx-auto min-w-[6rem]' onClick={handleListNft}>List Nft</Button>}
      {(nft.listingId && !nft.bids.length) ? <div className='text-gray-800 text-lg tracking-widest mx-auto font-medium uppercase'>Listed</div> : <></>}
      {(nft.listingId && nft.bids.length) ? <>
        <div className='text-gray-800 text-lg tracking-widest mx-auto font-medium uppercase'>Listed</div>
        <Button variant="default" className='mx-auto'>{`Show Bids (${nft.bids.length})`}</Button>
      </> : <></>}
      {nft.listingId && nft.collateralized && <Button variant="default" className='mx-auto'>See Loan Details</Button>}
    </CardFooter>
  )};

const LenderFooter = ({nft}: {nft: Nft}) => {
  if (!nft.listingId) return <div>Missing listingId</div>;

  const bidsStatus = nft.bids.length
    ? <div className='mx-auto text-gray-600 text-lg tracking-widest font-medium'>
        {`Bids: ${nft.bids.length}`}
    </div>
    : <></>;
  
  const myBidDisplay = nft.bids.some(bid => bid.bidder === LENDER_ALICE)
    ? <div className='mx-auto text-foreground text-lg tracking-widest font-medium uppercase'>My Bid ✅</div>
    : <BidButton listingId={nft.listingId}/>;
  return <CardFooter>
    {nft.listingId && <>
      {bidsStatus}
      {myBidDisplay}
    </>
    }
  </CardFooter>
};

export default NftCard