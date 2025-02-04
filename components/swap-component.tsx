"use client";

import { useState, useEffect } from "react";
import { useBalance, useAccount, useChainId } from "wagmi";
import { formatUnits, parseUnits } from "viem";
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

enum SwapTokenState {
  QUOTE = "quote",
  READY = "ready",
  SWAPPED = "swapped",
}

export default function CryptoSwap() {
  const [sellAmount, setSellAmount] = useState<string>("");
  const [buyAmount, setBuyAmount] = useState<string>("");
  const chainId = useChainId();
  
  const [filteredTokenSellList, setFilteredTokenSellList] = useState<Token[]>(tokenList);
  const [filteredTokenBuyList, setFilteredTokenBuyList] = useState<Token[]>(tokenList);
  const [selectedSellToken, setSelectedSellToken] = useState<Token | undefined>(undefined);
  const [selectedBuyToken, setSelectedBuyToken] = useState<Token | undefined>(undefined);

  const [swapOrderState, setSwapOrderState] = useState<boolean>(false);

  const [swapTokenState, setSwapTokenState] = useState<SwapTokenState>(SwapTokenState.QUOTE);

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
    if (swapOrderState === true) {
      fetchQuote(selectedSellToken!.address, selectedBuyToken!.address, sellAmount);
    }

    if (swapOrderState === false) {
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
  }

  function refetchBuySide() {
    if (swapOrderState === true) {
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

    if (swapOrderState === false) {
      fetchQuote(selectedSellToken!.address, selectedBuyToken!.address, sellAmount);
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

  function handleSwapTokens() {
    // Swap the selected tokens
    const tempToken = selectedSellToken;
    setSelectedSellToken(selectedBuyToken);
    setSelectedBuyToken(tempToken);
    
    // Swap the amounts
    const tempAmount = sellAmount;
    setSellAmount(buyAmount);
    setBuyAmount(tempAmount);

    // update the filtered lists
    const newBuyList = filteredTokenSellList
    const newSellList = filteredTokenBuyList
    setFilteredTokenBuyList(newBuyList);
    setFilteredTokenSellList(newSellList);

    // update the swap order state
    setSwapOrderState(!swapOrderState);
  }

  async function fetchQuote(tokenA: string, tokenB: string, tokenAmountIn: string) {
    // delay for 0.2 seconds
    await new Promise(resolve => setTimeout(resolve, 800));

    let quoteAmount;
    switch (tokenA) {
      case "eip155:84532/0xeeeEEEeEEeeeEeEeEEEeEeeeeEEEEeEEeEeeeeeE":
        switch (tokenB) {
          case "eip155:84532/0x0000000000000000000000000000000000000001":
            quoteAmount = parseUnits(tokenAmountIn, 18) * BigInt(Math.floor(Math.random() * (2700 - 2600 + 1)) + 2600);
            setBuyAmount(formatUnits(quoteAmount, 18));
            break;
          case "eip155:84532/0x0000000000000000000000000000000000000002":
            quoteAmount = parseUnits(tokenAmountIn, 18) * BigInt(Math.floor(Math.random() * (2700 - 2600 + 1)) + 2600);
            setBuyAmount(formatUnits(quoteAmount, 18));
            break;
          default:
            quoteAmount = parseUnits(tokenAmountIn, 18) * BigInt(Math.floor(Math.random() * (2700 - 2600 + 1)) + 2600);
            setBuyAmount(formatUnits(quoteAmount, 18));
        }
        break;

      case "eip155:84532/0x0000000000000000000000000000000000000001":
        switch (tokenB) {
          case "eip155:84532/0x0000000000000000000000000000000000000002":
            // quote same amount
            quoteAmount = parseUnits(tokenAmountIn, 18) * BigInt(1);
            setBuyAmount(formatUnits(quoteAmount, 18));
            break;
          case "eip155:84532/0xeeeEEEeEEeeeEeEeEEEeEeeeeEEEEeEEeEeeeeeE":
            // quote random amount opposite of sell token
            quoteAmount = parseUnits(tokenAmountIn, 18) / BigInt(Math.floor(Math.random() * (2700 - 2600 + 1)) + 2600);
            setBuyAmount(formatUnits(quoteAmount, 18));
            break;
          default:
            quoteAmount = parseUnits(tokenAmountIn, 18) * BigInt(Math.floor(Math.random() * (2700 - 2600 + 1)) + 2600);
            setBuyAmount(formatUnits(quoteAmount, 18));
        }
    }
    
    setSwapTokenState(SwapTokenState.READY);
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
          <div className={`flex flex-col gap-2 rounded-2xl p-4 border-2 border-muted ${swapOrderState ? "bg-secondary" : ""}`}>
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
                      { selectedSellToken ? (
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
                              selectedSellToken?.symbol === nativeBalance.symbol ? (
                              <>
                                <Image
                                  src={`/logos/${nativeBalance.symbol.toLowerCase()}.svg`}
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
                                  src={selectedSellToken!.icon.toLowerCase()}
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
                        ) : (
                          <Button>
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
                            {filteredTokenSellList.map((token) => (
                              <Button
                                key={token.name}
                                variant="ghost"
                                className="flex flex-row items-center justify-start text-left py-2 pl-4 h-auto"
                                onClick={() => handleSelectSellToken(token)}
                              >
                                <div className="flex flex-row items-center gap-2">
                                  <Image
                                    src={token.icon.toLowerCase()}
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
                      { selectedSellToken ? (
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
                              selectedSellToken?.symbol === nativeBalance.symbol ? (
                              <>
                                <Image
                                  src={`/logos/${nativeBalance.symbol.toLowerCase()}.svg`}
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
                                  src={selectedSellToken!.icon.toLowerCase()}
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
                        ) : (
                          <Button>
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
                            {filteredTokenSellList.map((token) => (
                              <Button
                                key={token.name}
                                variant="ghost"
                                className="flex flex-row items-center justify-start text-left py-2 pl-4 h-auto"
                                onClick={() => handleSelectSellToken(token)}
                              >
                                <div className="flex flex-row items-center gap-2">
                                  <Image
                                    src={token.icon.toLowerCase()}
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
              {
                swapOrderState ? (
                  <div className="flex flex-row items-center gap-2">
                    <div className="text-muted-foreground">
                      0.0000
                    </div>
                  </div>
              ) : (
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
              )}
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex flex-col justify-center items-center">
            <Button
              variant="outline"
              size="icon"
              className="rounded-lg bg-background border-2 border-muted"
              onClick={handleSwapTokens}
            >
              <ChevronsUpDown className="h-6 w-6" />
            </Button>
          </div>

          {/* Buy Field */}
          <div className={`flex flex-col gap-2 rounded-2xl p-4 border-2 border-muted ${swapOrderState ? "" : "bg-secondary"}`}>
            <div className="flex flex-row items-center justify-between">
              <div className="text-muted-foreground text-xl">Buy</div>
              <Button variant="ghost" size="icon" onClick={refetchBuySide}>
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
                              src={selectedBuyToken.icon.toLowerCase()}
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
                                    src={token.icon.toLowerCase()}
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
                              src={selectedBuyToken.icon.toLowerCase()}
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
                                    src={token.icon.toLowerCase()}
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
              {
                swapOrderState ? (
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
              ) : (
                <div className="flex flex-row items-center gap-2">
                  <div className="text-muted-foreground">
                    0.0000
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          {
            sellAmount !== "" && swapTokenState === SwapTokenState.QUOTE ? (
              <Button
                className="w-full rounded-xl h-14 text-lg mt-4"
                onClick={() => fetchQuote(selectedSellToken!.address, selectedBuyToken!.address, sellAmount)}
              >
                Find a quote
              </Button>
            ) : sellAmount === ""  ? (
              <Button
                className="w-full rounded-xl h-14 text-lg mt-4"
                disabled={true}
              >
                Enter an amount
              </Button>
            ) : swapTokenState === SwapTokenState.READY ? (
              <Button
                className="w-full rounded-xl h-14 text-lg mt-4"
              >
                Review
              </Button>
            ) : (
              <Button
                className="w-full rounded-xl h-14 text-lg mt-4"
              >
                Swap
              </Button>
            )
          }
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
    address: "eip155:84532/0x0000000000000000000000000000000000000001",
  },
  {
    name: "Tether",
    symbol: "USDT",
    icon: "/logos/usdt.svg",
    address: "eip155:84532/0x0000000000000000000000000000000000000002",
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
    address: "eip155:1001/0x0000000000000000000000000000000000000001",
  },
  {
    name: "Tether",
    symbol: "USDT",
    icon: "/logos/usdt.svg",
    address: "eip155:1001/0x0000000000000000000000000000000000000002",
  },
];