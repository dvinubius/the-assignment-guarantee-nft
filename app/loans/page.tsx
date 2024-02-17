import UserRoleTabs from '@/components/UserRoleTabs'
import React from 'react'
import BorrowerLoans from './components/BorrowerLoans'
import LenderLoans from './components/LenderLoans'

function LoansPage() {
  return (
   <UserRoleTabs borrowerTabContent={<BorrowerLoans/>} lenderTabContent={<LenderLoans/>}/>
  )
}

export default LoansPage