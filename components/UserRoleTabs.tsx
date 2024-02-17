import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function UserRoleTabs(
  { borrowerTabContent, lenderTabContent } : 
  {borrowerTabContent: React.ReactNode, lenderTabContent: React.ReactNode}) 
{
  const tabsTriggerClassName = `grow text-2xl px-12
    relative before:absolute before:content-[''] before:w-full before:top-[-16px] before:l-0 before:h-[12px] before-z-10`;
  const tabsContentClassName = `pt-12 w-full`;
  return (
    <Tabs defaultValue="borrower" className="w-full max-w-screen-xl flex flex-col items-center pt-12">
      <TabsList className='flex p-0'>
        <TabsTrigger value="borrower" className={tabsTriggerClassName}>Borrower</TabsTrigger>
        <TabsTrigger value="lender" className={tabsTriggerClassName}>Lender</TabsTrigger>
      </TabsList>
      <TabsContent value="borrower" className={tabsContentClassName}>{borrowerTabContent}</TabsContent>
      <TabsContent value="lender" className={tabsContentClassName}>{lenderTabContent}</TabsContent>
    </Tabs>
  )
}

export default UserRoleTabs