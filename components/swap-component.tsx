"use client";

import { useState, useEffect } from "react";
import { useBalance, useAccount, useChainId } from "wagmi";
import { formatUnits } from "viem";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Settings,
  ChevronDown,
  ChevronsUpDown,
  RefreshCcw,
  Coins,
} from "lucide-react";
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
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

interface Token {
  name: string;
  symbol: string;
  icon: string;
  address: string;
}

export default function CryptoSwap() {
  const [sellAmount, setSellAmount] = useState<string>("");
  const [buyAmount, setBuyAmount] = useState<string>("");
  const chainId = useChainId();
  
  const [filteredTokenSellList, setFilteredTokenSellList] = useState<Token[]>(tokenList);
  const [filteredTokenBuyList, setFilteredTokenBuyList] = useState<Token[]>(tokenList);
  const [selectedSellToken, setSelectedSellToken] = useState<Token | undefined>(undefined);
  const [selectedBuyToken, setSelectedBuyToken] = useState<Token | undefined>(undefined);

  useEffect(() => {
    const filtered = tokenList.filter(
      (token) => token.address.split("/")[0] === `eip155:${chainId}`
    );
    setFilteredTokenSellList(filtered);
    const initialSellToken = filtered.find((token) => token.address.split("/")[1] === "0xeeeEEEeEEeeeEeEeEEEeEeeeeEEEEeEEeEeeeeeE");
    setSelectedSellToken(initialSellToken);
    
    // Filter out the selected sell token from buy list
    const filteredBuyList = filtered.filter(token => token !== initialSellToken);
    setFilteredTokenBuyList(filteredBuyList);
    
    setSelectedBuyToken(undefined); // Reset buy token when chain changes
  }, [chainId]);

  // get account
  const account = useAccount();

  // get native balance
  const {
    data: nativeBalance,
    isPending: isNativeBalancePending,
    isSuccess: isNativeBalanceSuccess,
    isError: isNativeBalanceError,
    refetch: refetchNativeBalance,
  } = useBalance({
    address: account.address,
  });

  // useMediaQuery hook to check if the screen is desktop
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // toast
  const { toast } = useToast();

  // dialog open close state
  const [buyMenuState, setBuyMenuState] = useState<boolean>(false);
  const [sellMenuState, setSellMenuState] = useState<boolean>(false);

  function truncateAddress(address: string): string {
    return address.slice(0, 6) + "..." + address.slice(-4);
  }

  function roundBalanceString(balanceString: string): string {
    const balance = parseFloat(balanceString);
    return balance.toFixed(4);
  }

  function refetchSellSide() {
    refetchNativeBalance();
    if (isNativeBalanceSuccess) {
      toast({
        description: "Refetched data!",
      });
    }
    if (isNativeBalanceError) {
      toast({
        description: "Error refetching data!",
        variant: "destructive",
      });
    }
  }

  function inputMaxSellAmount() {
    setSellAmount(
      formatUnits(
        nativeBalance?.value || BigInt(0),
        nativeBalance?.decimals || 18
      )
    );
  }

  function handleSelectSellToken(token: Token): void {
    setSelectedSellToken(token);
    setSellMenuState(false);
    
    // Update buy list to exclude the selected sell token
    const newBuyList = filteredTokenSellList.filter(t => t !== token);
    setFilteredTokenBuyList(newBuyList);
    
    // If the selected buy token is the same as the new sell token, reset it
    if (selectedBuyToken === token) {
      setSelectedBuyToken(undefined);
    }
  }

  function handleSelectBuyToken(token: Token): void {
    setSelectedBuyToken(token);
    setBuyMenuState(false);
  }

  return (
    <div className="min-h-screen flex justify-center items-start">
      <div className="w-full max-w-md">
        {/* Navigation */}
        <div className="flex flex-row items-end justify-end mb-4">
          <Button variant="ghost" size="icon">
            <Settings />
          </Button>
        </div>
        {/* Swap Interface */}
        <div className="flex flex-col gap-4">
          {/* Sell Field */}
          <div className="flex flex-col gap-2 rounded-2xl p-4 border-2 border-muted">
            <div className="flex flex-row items-center justify-between">
              <div className="text-muted-foreground text-xl">Sell</div>
              <Button variant="ghost" size="icon" onClick={refetchSellSide}>
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
                  <Dialog open={sellMenuState} onOpenChange={setSellMenuState}>
                    <DialogTrigger asChild>
                      <Button
                        className="flex flex-row items-center gap-2 pl-5 pr-6 rounded-full"
                        variant="outline"
                      >
                        {account.address === undefined &&
                        nativeBalance === undefined ? (
                          <>
                            <Image
                              src={`/logos/eth.svg`}
                              alt="eth"
                              width={30}
                              height={30}
                              className="rounded-full"
                            />
                            <div className="text-lg font-semibold">
                              ETH
                            </div>
                            <ChevronDown className="h-4 w-4" />
                          </>
                        ) : account.address && nativeBalance === undefined ? (
                          <Skeleton className="w-6 h-6 rounded-full" />
                        ) : account.address &&
                          nativeBalance !== undefined &&
                          selectedSellToken!.symbol === nativeBalance.symbol ? (
                          <>
                            <Image
                              src={`/logos/${nativeBalance.symbol}.svg`}
                              alt={nativeBalance.symbol}
                              width={30}
                              height={30}
                              className="rounded-full"
                            />
                            <div className="text-lg font-semibold">
                              {nativeBalance.symbol}
                            </div>
                            <ChevronDown className="h-4 w-4" />
                          </>
                        ) : (
                          <>
                            <Image
                              src={selectedSellToken!.icon}
                              alt={selectedSellToken!.name}
                              width={30}
                              height={30}
                              className="rounded-full"
                            />
                            <div className="text-lg font-semibold">
                              {selectedSellToken!.symbol}
                            </div>
                            <ChevronDown className="h-4 w-4" />
                          </>
                        )}
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
                            <Coins className="h-4 w-4" />
                            Tokens
                          </div>
                          <div className="flex flex-col gap-2">
                            {filteredTokenSellList.map((token) => (
                              <Button
                                key={token.name}
                                variant="ghost"
                                className="flex flex-row items-center justify-start text-left py-2 pl-4 h-auto"
                                onClick={() => handleSelectSellToken(token)}
                              >
                                <div className="flex flex-row items-center gap-2">
                                  <Image
                                    src={token.icon}
                                    alt={token.name}
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                  />
                                  <div className="flex flex-col gap-1">
                                    <div className="text-lg">{token.name}</div>
                                    <div className="flex flex-row items-center gap-2">
                                      <div className="text-md text-muted-foreground">
                                        {token.symbol}
                                      </div>
                                      <div className="text-md font-mono text-muted-foreground">
                                        {truncateAddress(
                                          token.address.split("/")[1]
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Drawer open={sellMenuState} onOpenChange={setSellMenuState}>
                    <DrawerTrigger asChild>
                      <Button
                        className="flex flex-row items-center gap-2 pl-5 pr-6 rounded-full"
                        variant="outline"
                      >
                        {account.address === undefined ||
                        nativeBalance === undefined ? (
                          <>
                            <Image
                              src={`/logos/eth.svg`}
                              alt="eth"
                              width={30}
                              height={30}
                              className="rounded-full"
                            />
                            <div className="text-lg font-semibold">ETH</div>
                            <ChevronDown className="h-4 w-4" />
                          </>
                        ) : account.address && nativeBalance === undefined ? (
                          <Skeleton className="w-6 h-6 rounded-full" />
                        ) : account.address &&
                          nativeBalance !== undefined &&
                          selectedSellToken!.symbol === nativeBalance.symbol ? (
                          <>
                            <Image
                              src={`/logos/${nativeBalance.symbol}.svg`}
                              alt={nativeBalance.symbol}
                              width={30}
                              height={30}
                              className="rounded-full"
                            />
                            <div className="text-lg font-semibold">
                              {nativeBalance.symbol}
                            </div>
                            <ChevronDown className="h-4 w-4" />
                          </>
                        ) : (
                          <>
                            <Image
                              src={selectedSellToken!.icon}
                              alt={selectedSellToken!.name}
                              width={30}
                              height={30}
                              className="rounded-full"
                            />
                            <div className="text-lg font-semibold">
                              {selectedSellToken!.symbol}
                            </div>
                            <ChevronDown className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                      <DrawerHeader>
                        <DrawerTitle>Select a token</DrawerTitle>
                        <DrawerDescription>
                          Choose the token from your wallet or a supported token below
                        </DrawerDescription>
                      </DrawerHeader>
                      <div className="flex flex-col gap-4 p-4">
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-row items-center gap-2 text-lg text-muted-foreground">
                            <Coins className="h-4 w-4" />
                            Tokens
                          </div>
                          <div className="flex flex-col gap-2">
                            {filteredTokenSellList.map((token) => (
                              <Button
                                key={token.name}
                                variant="ghost"
                                className="flex flex-row items-center justify-start text-left py-2 pl-4 h-auto"
                                onClick={() => handleSelectSellToken(token)}
                              >
                                <div className="flex flex-row items-center gap-2">
                                  <Image
                                    src={token.icon}
                                    alt={token.name}
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                  />
                                  <div className="flex flex-col gap-1">
                                    <div className="text-lg">{token.name}</div>
                                    <div className="flex flex-row items-center gap-2">
                                      <div className="text-md text-muted-foreground">
                                        {token.symbol}
                                      </div>
                                      <div className="text-md font-mono text-muted-foreground">
                                        {truncateAddress(token.address.split("/")[1])}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                      <DrawerFooter className="pt-2">
                        <DrawerClose asChild>
                          <Button variant="outline">Close</Button>
                        </DrawerClose>
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>
                )}
              </div>
            </div>
            <div className="flex flex-row items-center justify-between">
              <div className="text-muted-foreground">$ -</div>
              <div className="flex flex-row items-center gap-2">
                {account.address === undefined ? null : account.address &&
                  isNativeBalancePending ? (
                  <Skeleton className="w-8 h-8 rounded-md" />
                ) : (
                  <>
                    <div className="text-muted-foreground">
                      {roundBalanceString(
                        formatUnits(
                          nativeBalance?.value || BigInt(0),
                          nativeBalance?.decimals || 18
                        )
                      )}{" "}
                      {nativeBalance?.symbol}
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={inputMaxSellAmount}
                    >
                      Max
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex flex-col justify-center items-center">
            <Button
              variant="outline"
              size="icon"
              className="rounded-lg bg-background border-2 border-muted"
            >
              <ChevronsUpDown className="h-6 w-6" />
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
                {isDesktop ? (
                  <Dialog open={buyMenuState} onOpenChange={setBuyMenuState}>
                    <DialogTrigger asChild>
                      {
                        selectedBuyToken ? (
                          <Button
                          className="flex flex-row items-center gap-2 pl-5 pr-6 rounded-full"
                          variant="outline"
                          >
                            <Image
                              src={selectedBuyToken.icon}
                              alt={selectedBuyToken.name}
                              width={30}
                              height={30}
                              className="rounded-full"
                            />
                            <div className="text-lg font-semibold">
                              {selectedBuyToken.symbol}
                            </div>
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                          >
                            Select a token
                          </Button>
                        )
                      }
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
                            <Coins className="h-4 w-4" />
                            Tokens
                          </div>
                          <div className="flex flex-col gap-2">
                            {filteredTokenBuyList.map((token) => (
                              <Button
                                key={token.name}
                                variant="ghost"
                                className="flex flex-row items-center justify-start text-left py-2 pl-4 h-auto"
                                onClick={() => handleSelectBuyToken(token)}
                              >
                                <div className="flex flex-row items-center gap-2">
                                  <Image
                                    src={token.icon}
                                    alt={token.name}
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                  />
                                  <div className="flex flex-col gap-1">
                                    <div className="text-lg">{token.name}</div>
                                    <div className="flex flex-row items-center gap-2">
                                      <div className="text-md text-muted-foreground">
                                        {token.symbol}
                                      </div>
                                      <div className="text-md font-mono text-muted-foreground">
                                        {truncateAddress(
                                          token.address.split("/")[1]
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Drawer open={buyMenuState} onOpenChange={setBuyMenuState}>
                    <DrawerTrigger asChild>
                      {
                        selectedBuyToken ? (
                          <Button
                          className="flex flex-row items-center gap-2 pl-5 pr-6 rounded-full"
                          variant="outline"
                          >
                            <Image
                              src={selectedBuyToken.icon}
                              alt={selectedBuyToken.name}
                              width={30}
                              height={30}
                              className="rounded-full"
                            />
                            <div className="text-lg font-semibold">
                              {selectedBuyToken.symbol}
                            </div>
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                          >
                            Select a token
                          </Button>
                        )
                      }
                    </DrawerTrigger>
                    <DrawerContent>
                      <DrawerHeader>
                        <DrawerTitle>Select a token</DrawerTitle>
                        <DrawerDescription>
                          Choose the token from your wallet or a supported token below
                        </DrawerDescription>
                      </DrawerHeader>
                      <div className="flex flex-col gap-4 p-4">
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-row items-center gap-2 text-lg text-muted-foreground">
                            <Coins className="h-4 w-4" />
                            Tokens
                          </div>
                          <div className="flex flex-col gap-2">
                            {filteredTokenBuyList.map((token) => (
                              <Button
                                key={token.name}
                                variant="ghost"
                                className="flex flex-row items-center justify-start text-left py-2 pl-4 h-auto"
                                onClick={() => handleSelectBuyToken(token)}
                              >
                                <div className="flex flex-row items-center gap-2">
                                  <Image
                                    src={token.icon}
                                    alt={token.name}
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                  />
                                  <div className="flex flex-col gap-1">
                                    <div className="text-lg">{token.name}</div>
                                    <div className="flex flex-row items-center gap-2">
                                      <div className="text-md text-muted-foreground">
                                        {token.symbol}
                                      </div>
                                      <div className="text-md font-mono text-muted-foreground">
                                        {truncateAddress(token.address.split("/")[1])}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                      <DrawerFooter className="pt-2">
                        <DrawerClose asChild>
                          <Button variant="outline">Close</Button>
                        </DrawerClose>
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>
                )}
              </div>
            </div>
            <div className="flex flex-row items-center justify-between">
              <div className="text-muted-foreground">$ -</div>
              <div className="text-muted-foreground">
                0.0000
              </div>
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

// Add type for the token list
const tokenList: Token[] = [
  {
    name: "Ethereum",
    symbol: "ETH",
    icon: "/logos/eth.svg",
    address: "eip155:84532/0xeeeEEEeEEeeeEeEeEEEeEeeeeEEEEeEEeEeeeeeE",
  },
  {
    name: "USD Coin",
    symbol: "USDC",
    icon: "/logos/usdc.svg",
    address: "eip155:84532/0x0000000000000000000000000000000000000000",
  },
  {
    name: "Tether",
    symbol: "USDT",
    icon: "/logos/usdt.svg",
    address: "eip155:84532/0x0000000000000000000000000000000000000000",
  },
  {
    name: "Kaia",
    symbol: "KAIA",
    icon: "/logos/kaia.svg",
    address: "eip155:1001/0xeeeEEEeEEeeeEeEeEEEeEeeeeEEEEeEEeEeeeeeE",
  },
  {
    name: "USD Coin",
    symbol: "USDC",
    icon: "/logos/usdc.svg",
    address: "eip155:1001/0x0000000000000000000000000000000000000000",
  },
  {
    name: "Tether",
    symbol: "USDT",
    icon: "/logos/usdt.svg",
    address: "eip155:1001/0x0000000000000000000000000000000000000000",
  },
];