"use client";

import { useAccount, useBalance, useReadContracts } from "wagmi";
import { Address, erc20Abi, formatEther, formatUnits } from "viem";
import {
  LogOut,
  Settings,
  CreditCard,
  CircleArrowDown,
  ChevronLast,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { truncateAddress, roundBalanceString, getEmojiFromAddress } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";

export function PortfolioSidebar() {
  const { address } = useAccount();

  return (
    <div className="flex flex-col gap-8 w-full md:w-[360px] h-screen border-1 shadow-md rounded-md px-4 py-6">
      {/* Header */}
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-2 items-center">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary">
            <span className="text-xl">
              {address ? getEmojiFromAddress(address) : '👻'}
            </span>
          </div>
          <p className="text-md">{truncateAddress(address || "", 6, 4)}</p>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <Button variant="ghost" size="icon">
            <Settings />
          </Button>
          <Button variant="ghost" size="icon">
            <LogOut />
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-2 gap-2">
          <Button
            className="flex flex-col gap-2 h-fit p-4 items-start justify-center [&_svg]:size-6"
            variant="secondary"
          >
            <CreditCard />
            <p className="text-lg">Buy</p>
          </Button>
          <Button
            className="flex flex-col gap-2 h-fit p-4 items-start justify-center [&_svg]:size-6"
            variant="secondary"
          >
            <CircleArrowDown />
            <p className="text-lg">Receive</p>
          </Button>
        </div>
        <Tabs defaultValue="tokens" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tokens">Tokens</TabsTrigger>
            <TabsTrigger value="nfts">NFTs</TabsTrigger>
          </TabsList>
          <TabsContent value="tokens">
            <div className="flex flex-col gap-4 mt-8">
              {tokenList.map((token) => (
                <TokenBalanceCard
                  key={token.address}
                  address={address as Address}
                  token={token}
                />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="nfts">
            <div>
              <h1 className="text-2xl font-bold">NFTs</h1>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <div className="flex flex-row gap-2">
        <Button variant="outline" className="w-full">
          <ChevronLast />
          Close
        </Button>
      </div>
    </div>
  );
}

const tokenList = [
  {
    name: "Sepolia",
    symbol: "ETH",
    icon: "/logos/eth.svg",
    address: "eip155:11155111/0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  },
  {
    name: "Base Sepolia",
    symbol: "ETH",
    icon: "/logos/eth.svg",
    address: "eip155:84532/0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  },
  {
    name: "Arbitrum Sepolia",
    symbol: "ETH",
    icon: "/logos/eth.svg",
    address: "eip155:421614/0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  },
  {
    name: "Kaia",
    symbol: "ETH",
    icon: "/logos/kaia.svg",
    address: "eip155:1001/0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  },
];

interface Token {
  name: string;
  symbol: string;
  icon: string;
  address: string;
}

interface BalanceCardProps {
  address: Address;
  token: Token;
}

function TokenBalanceCard({ address, token }: BalanceCardProps) {
  // Use the hook unconditionally, but pass undefined if it's not the ETH address
  const { data: nativeBalance, isLoading: isNativeBalanceLoading } = useBalance({
    address:
      token.address.split(":")[1].split("/")[1] ===
      "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
        ? address
        : undefined,
    chainId: parseInt(token.address.split(":")[1].split("/")[0]),
  });

  const tokenContract = {
    address:
      token.address.split(":")[1].split("/")[1] ===
      "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
        ? address
        : undefined,
    abi: erc20Abi,
    chainId: parseInt(token.address.split(":")[1].split("/")[0]),
  } as const;

  const { data: tokenData, isLoading: isTokenDataLoading } = useReadContracts({
    contracts: [
      {
        ...tokenContract,
        functionName: "balanceOf",
        args: [address as Address],
      },
      {
        ...tokenContract,
        functionName: "symbol",
      },
      {
        ...tokenContract,
        functionName: "decimals",
      },
      {
        ...tokenContract,
        functionName: "name",
      },
    ],
  });

  if (
    token.address.split(":")[1].split("/")[1] ===
    "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
  ) {
    return (
      <>
        {isNativeBalanceLoading ? (
          <div className="flex flex-row gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex flex-col gap-1">
              <Skeleton className="w-40 h-4" />
              <Skeleton className="w-40 h-4" />
            </div>
          </div>
        ) : (
          nativeBalance?.value && nativeBalance.value > BigInt(0) && (
            <div className="flex flex-row gap-3">
              <Image
                src={token.icon}
                alt={token.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="flex flex-col items-start">
                <p className="text-sm">{token.name}</p>
                <p className="text-sm text-muted-foreground">
                  {roundBalanceString(
                    formatEther((nativeBalance?.value as bigint) || BigInt(0))
                  )}{" "}
                  ETH
                </p>
              </div>
            </div>
          )
        )}
      </>
    );
  }

  if (
    token.address.split(":")[1].split("/")[1] !==
    "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
  ) {
    return (
      <>
        {isTokenDataLoading ? (
          <div className="flex flex-row gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex flex-col gap-1">
              <Skeleton className="w-24 h-4" />
              <Skeleton className="w-20 h-4" />
            </div>
          </div>
        ) : (
          tokenData?.[0]?.result && tokenData[0].result > BigInt(0) && (
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-2 items-center">
                <Image src={token.icon} alt={token.name} width={40} height={40} />
                <p className="text-md">{tokenData?.[1]?.result}</p>
              </div>
              <p className="text-md">
                {roundBalanceString(
                  formatUnits(
                    (tokenData?.[0]?.result as bigint) || BigInt(0),
                    (tokenData?.[2]?.result as number) || 18
                  )
                )}{" "}
                {tokenData?.[1]?.result}
              </p>
            </div>
          )
        )}
      </>
    );
  }
}
