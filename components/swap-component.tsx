"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings, ChevronDown, RefreshCcw, Wallet, Coins } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMediaQuery } from "@/hooks/use-media-query";
import Image from "next/image";

const tokenList = [
  {
    name: "Ethereum",
    symbol: "ETH",
    icon: "/logos/eth.svg",
    address: "0xeeeEEEeEEeeeEeEeEEEeEeeeeEEEEeEEeEeeeeeE",
  },
  {
    name: "USD Coin",
    symbol: "USDC",
    icon: "/logos/usdc.svg",
    address: "0x0000000000000000000000000000000000000000",
  },
  {
    name: "Tether",
    symbol: "USDT",
    icon: "/logos/usdt.svg",
    address: "0x0000000000000000000000000000000000000000",
  },
];

export default function CryptoSwap() {
  const [sellAmount, setSellAmount] = useState("");
  const [buyAmount, setBuyAmount] = useState("");

  // useMediaQuery hook to check if the screen is desktop
  const isDesktop = useMediaQuery("(min-width: 768px)");

  function truncateAddress(address: string) {
    return address.slice(0, 6) + "..." + address.slice(-4);
  }

  return (
    <div className="min-h-screen p-4 flex justify-center items-start">
      <div className="w-full max-w-md">
        {/* Navigation */}
        <div className="flex flex-row items-end justify-end mb-4">
          <Button variant="ghost" size="icon">
            <Settings />
          </Button>
        </div>

        {/* Swap Interface */}
        <div className="flex flex-col">
          {/* Sell Field */}
          <div className="flex flex-col gap-2 rounded-2xl p-4 border-2 border-muted">
            <div className="flex flex-row items-center justify-between">
              <div className="text-muted-foreground text-xl">Sell</div>
              <Button variant="ghost" size="icon">
                <RefreshCcw />
              </Button>
            </div>
            <div className="flex flex-row items-center justify-between">
              <input
                type="text"
                value={sellAmount}
                onChange={(e) => setSellAmount(e.target.value)}
                placeholder="0"
                className="bg-transparent text-4xl outline-none w-full"
              />
              <div className="flex flex-col items-end gap-2">
                {isDesktop ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="flex flex-row items-center gap-2 pl-5 pr-6 rounded-full"
                        variant="outline"
                      >
                        <Image
                          src={tokenList[0].icon}
                          alt={tokenList[0].name}
                          width={30}
                          height={30}
                        />
                        <div className="text-lg font-semibold">
                          {tokenList[0].symbol}
                        </div>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Select a token</DialogTitle>
                        <DialogDescription>
                          Choose the token from your wallet or a supported token
                          below
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-row items-center gap-2 text-lg text-muted-foreground">
                            <Wallet className="h-4 w-4" />
                            Your tokens
                          </div>
                          <div className="flex flex-col gap-4">
                            {tokenList.map((token) => (
                              <div
                                key={token.name}
                                className="flex flex-row items-center gap-2"
                              >
                                <Image
                                  src={token.icon}
                                  alt={token.name}
                                  width={40}
                                  height={40}
                                />
                                <div className="flex flex-col">
                                  <div className="text-lg font-medium">
                                    {token.name}
                                  </div>
                                  <div className="flex flex-row items-center gap-2">
                                    <div className="text-md text-muted-foreground">
                                      {token.symbol}
                                    </div>
                                    <div className="text-md font-mono text-muted-foreground">
                                      {truncateAddress(token.address)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-row items-center gap-2 text-lg text-muted-foreground">
                            <Coins className="h-4 w-4" />
                            Tokens
                          </div>
                          <div className="flex flex-col gap-4">
                            {tokenList.map((token) => (
                              <div
                                key={token.name}
                                className="flex flex-row items-center gap-2"
                              >
                                <Image
                                  src={token.icon}
                                  alt={token.name}
                                  width={40}
                                  height={40}
                                />
                                <div className="flex flex-col">
                                  <div className="text-lg">{token.name}</div>
                                  <div className="flex flex-row items-center gap-2">
                                    <div className="text-md text-muted-foreground">
                                      {token.symbol}
                                    </div>
                                    <div className="text-md font-mono text-muted-foreground">
                                      {truncateAddress(token.address)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Drawer>
                    <DrawerTrigger asChild>
                      <Button
                        className="flex flex-row items-center gap-2 pl-5 pr-6 rounded-full"
                        variant="outline"
                      >
                        <Image
                          src={tokenList[0].icon}
                          alt={tokenList[0].name}
                          width={30}
                          height={30}
                        />
                        {tokenList[0].symbol}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                      <DrawerHeader>
                        <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                        <DrawerDescription>
                          This action cannot be undone. This will permanently
                          delete your account and remove your data from our
                          servers.
                        </DrawerDescription>
                      </DrawerHeader>
                    </DrawerContent>
                  </Drawer>
                )}
              </div>
            </div>
            <div className="flex flex-row items-center justify-between">
              <div className="text-muted-foreground">$0</div>
              <div className="flex flex-row items-center gap-2">
                <div className="text-muted-foreground">0.0002 ETH</div>
                <Button variant="secondary" size="sm">
                  Max
                </Button>
              </div>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center relative -my-[18px]">
            <Button
              variant="outline"
              size="icon"
              className="rounded-lg bg-background border-2 border-muted"
            >
              <ChevronDown className="h-6 w-6" />
            </Button>
          </div>

          {/* Buy Field */}
          <div className="flex flex-col gap-2 rounded-2xl p-4 border-2 border-muted bg-secondary">
            <div className="flex flex-row items-center justify-between">
              <div className="text-muted-foreground text-xl">Buy</div>
              <Button variant="ghost" size="icon">
                <RefreshCcw />
              </Button>
            </div>
            <div className="flex flex-row items-center justify-between">
              <input
                type="text"
                value={buyAmount}
                onChange={(e) => setBuyAmount(e.target.value)}
                placeholder="0"
                className="bg-transparent text-4xl outline-none w-full"
              />
              <div className="flex flex-col items-end gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <div className="flex flex-row items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-500" />
                        USDC
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>USDC</DropdownMenuItem>
                    <DropdownMenuItem>USDT</DropdownMenuItem>
                    <DropdownMenuItem>DAI</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="flex flex-row items-start">
              <div className="text-muted-foreground">$0</div>
            </div>
          </div>

          {/* Action Button */}
          <Button
            className="w-full rounded-xl h-14 text-lg mt-4"
            disabled={!sellAmount || !buyAmount}
          >
            Enter an amount
          </Button>
        </div>
      </div>
    </div>
  );
}
