'use client'

import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from "@/components/ui/input"
import { DialogClose } from '@radix-ui/react-dialog'
import { useSDK } from '@metamask/sdk-react'
import { ethers } from "ethers"
import { USDC_ABI } from '@/constants/abis/usdc'
import { USDC_CONTRACT_ADDRESS } from '@/constants/dummy-usdc-contract'
import { useToast } from './ui/use-toast'
import { LENDER_ALICE } from '@/constants/lender-alice'
import { Bid } from '@prisma/client'
import InfuraLogo from './InfuraLogo'

function BidButton({listingId}: {listingId: number}) {
  const [open, setOpen] = useState(false);
  const [txStatus, setTxStatus] = useState('');
  const { toast } = useToast();

  // useEffect(() => {
  //   const fetchBids = async () => {
  //     const getRequest = await fetch(`http://localhost:3000/api/listing/${listingId}/bids`);
  //     const { bids } = await getRequest.json();

  //     if (bids.some((bid: Bid) => bid.bidder === LENDER_ALICE)) {
  //       setTxStatus('Preparing Transaction')
  //     }
  //   }
  //   fetchBids();
  // }, [listingId]);

  const { sdk, connected } = useSDK();

  if (!connected) {
    return (
      <Button variant="default" className='mx-auto'
        onClick={() => sdk?.connect()}
      >
        Connect Wallet to Bid
      </Button>
    )
  };

  const BID_AMOUNT = 100;
  const REPAY_AMOUNT = 120;
  const DURATION_DAYS = 365;

  const handleSubmitBid = async () => {
    const postRequest = await fetch('http://localhost:3000/api/bid', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        listingId,
        bid: {
          bidder: LENDER_ALICE,
          amount: BID_AMOUNT,
          repayAmount: REPAY_AMOUNT,
          deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * DURATION_DAYS),
        }
      })
    });

    if (postRequest.status === 200) {
      toast({
        title: "Bid saved!",
        description: "Bid saved, proceed to approve USDC to complete the transaction.",
        duration: 3000,
      })
      setTxStatus('Preparing Transaction');
    };

  }


  const handleApprove = async () => {
    try {
      // send transaction to USDC contract to approve the loan amount
      const provider = new ethers.BrowserProvider(sdk!.getProvider()!);
      const signer = await provider.getSigner();
      const usdc = new ethers.Contract(USDC_CONTRACT_ADDRESS, USDC_ABI, signer);

      const amount = ethers.parseUnits(BID_AMOUNT.toString(), 18);

      setTxStatus('Approving USDC...');
      const tx = await usdc.approve(USDC_CONTRACT_ADDRESS, amount);
      setTxStatus('Transaction sent. Waiting for confirmation...');
      await tx.wait();
      setTxStatus('Transaction confirmed!');
    } catch (e) {
      console.error(e);
    }   
  };

  const handleOk = () => {
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className='mx-auto'>
        <Button variant="default" className='mx-auto'>Place Bid</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          {/* <DialogTitle>Place Bid</DialogTitle> */}
          <DialogDescription>
            <Card className={`w-full my-4`}>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <CardTitle>Place Your Bid</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className='flex flex-col gap-8'>
                  <div className='flex flex-col gap-2 items-start'>
                    <div className='font-semibold text-lg'>Currency</div>
                    <Input type="text" className='border border-gray-300 p-2 rounded-md text-lg' value={'USDC'} disabled/>
                  </div>
                  <div className='flex flex-col gap-2 items-start'>
                    <div className='font-semibold text-lg'>Loan Amount</div>
                    <Input type="number" className='border border-gray-300 p-2 rounded-md text-lg' value={BID_AMOUNT} disabled/>
                  </div>
                  <div className='flex flex-col gap-2 items-start'>
                    <div className='font-semibold text-lg'>Repay Amount</div>
                    <Input type="number" className='border border-gray-300 p-2 rounded-md text-lg' value={REPAY_AMOUNT} disabled/>
                  </div>
                  <div className='flex flex-col gap-2 items-start'>
                    <div className='font-semibold text-lg'>Duration (days)</div>
                    <Input type="number" className='border border-gray-300 p-2 rounded-md text-lg' value={DURATION_DAYS} disabled/>
                  </div>
                  <div className='mt-4 flex gap-2 items-center justify-center text-xl font-semibold'>
                    <div className=''>APR</div>
                    <div className=''>20 %</div>
                  </div>
                  {txStatus === 'Preparing Transaction' && (
                    <div className='text-lg flex flex-col items-center gap-4'>
                      <div className='animate-pulse '>Estimated Gas for Approval: 0.02 ETH</div>
                      <div className='max-w-[100px]'>
                        <InfuraLogo/>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className='flex justify-end w-full'>
            <DialogClose asChild>
              <Button variant="ghost" className='mx-auto'>Cancel</Button>
            </DialogClose>
            {txStatus === '' && <Button variant="default" type="submit" className='mx-auto' onClick={handleSubmitBid}>Place Bid</Button>}
            {txStatus === 'Preparing Transaction' && <Button variant="default" type="submit" className='mx-auto' onClick={handleApprove}>Approve USDC</Button>}
            {txStatus === 'Transaction confirmed!' && <div className='flex items-center gap-4'>
              <div className='text-lg font-medium'>Confirmed!</div>
              <Button variant="default" className='mx-auto' onClick={handleOk}>OK</Button>
            </div>}
            {!['','Transaction confirmed!', 'Preparing Transaction'].includes(txStatus) && <Button variant="default" className='mx-auto' disabled>{txStatus}</Button>}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default BidButton