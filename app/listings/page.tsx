import React from 'react'
import BorrowerListings from './components/BorrowerListings'
import LenderListings from './components/LenderListings'
import UserRoleTabs from '@/components/UserRoleTabs';


function ListingsPage() {
  return (
   <UserRoleTabs borrowerTabContent={<BorrowerListings/>} lenderTabContent={<LenderListings/>}/>
  )
}

export default ListingsPage