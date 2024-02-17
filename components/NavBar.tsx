"use client";

import Link from "next/link";

import WalletIcon from "../public/icons/WalletIcon";

import { Button } from "./ui/button";

import { useSDK } from "@metamask/sdk-react";
import { formatAddress } from "../lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useState } from "react";

export const ConnectWalletButton = () => {
  const { sdk, connected, connecting, account } = useSDK();

  const connect = async () => {
    try {
      await sdk?.connect();
    } catch (err) {
      console.warn(`No accounts found`, err);
    }
  };

  const disconnect = () => {
    if (sdk) {
      sdk.terminate();
    }
  };

  return (
    <div className="relative">
      {connected ? (
        <Popover>
          <PopoverTrigger>
            <Button>{formatAddress(account)}</Button>
          </PopoverTrigger>
          <PopoverContent className="mt-2 w-44 bg-gray-100 border rounded-md shadow-lg right-0 z-10 top-10">
            <button
              onClick={disconnect}
              className="block w-full pl-2 pr-4 py-2 text-left text-[#F05252] hover:bg-gray-200"
            >
              Disconnect
            </button>
          </PopoverContent>
        </Popover>
      ) : (
        <Button disabled={connecting} onClick={connect}>
          <WalletIcon className="mr-2 h-4 w-4" /> Connect Wallet
        </Button>
      )}
    </div>
  );
};


type Route = "listings" | "loans" | "";
const routes: Route[] = [ "", "listings", "loans"]; 

export const NavBar = () => {
  const [selected, setSelected] = useState<Route>("");

  return (
    <nav className="fixed w-full h-[5rem] flex items-center justify-between max-w-screen-xl px-6 mx-auto py-7 rounded-full bg-white">
      <Link href="/" className="flex gap-1 px-6">
        <span className="hidden text-2xl font-bold sm:block">
          <span className="text-gray-900">GuaranteeNFT</span>
        </span>
      </Link>
        <ul className='flex items-center text-xl gap-12 uppercase'>
          {routes.map((route: Route) => (
            <li key={route}>
              <Link
                href={`/${route}`}
                className={`tracking-widest font-medium 
                  transition-all duration-150
                `}
                // className={`tracking-widest font-medium 
                //   transition-all duration-150
                //   ${selected === route ? "border-b-[0.19rem] border-foreground" : "hover:border-b-2 hover:border-foreground"}
                // `}
                onClick={() => setSelected(route)}
              >
                {route === '' ? "Home" : route}
              </Link>
            </li>
          ))}
        </ul>
      <div className="flex gap-12 px-6">
          <ConnectWalletButton />
      </div>
    </nav>
  );
};

export default NavBar;
