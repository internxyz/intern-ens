import { useAccount, useBalance, useReadContracts } from "wagmi";
import { Address, erc20Abi, formatEther, formatUnits } from "viem";
import { LogOut, Settings, CreditCard, CircleArrowDown, ChevronLast } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { truncateAddress } from "@/lib/utils";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import Image from "next/image";


export function PortfolioSidebar() {
  const { address } = useAccount();

  return (
    <div className="flex flex-col gap-8 w-full md:w-[360px] border-1 shadow-md rounded-md px-4 py-6">
      {/* Header */}
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-2 items-center">
          <div className="w-10 h-10 rounded-full bg-primary"></div>
          <p className="text-md">{truncateAddress(address || '', 6, 4)}</p>
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
          <Button className="flex flex-col gap-2 h-fit p-4 items-start justify-center [&_svg]:size-6" variant="secondary">
            <CreditCard />
            <p className="text-lg">Buy</p>
          </Button>
          <Button className="flex flex-col gap-2 h-fit p-4 items-start justify-center [&_svg]:size-6" variant="secondary">
            <CircleArrowDown />
            <p className="text-lg">Receive</p>
          </Button>
        </div>
        <Tabs defaultValue="tokens" className="w-fit">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tokens">Tokens</TabsTrigger>
            <TabsTrigger value="nfts">NFTs</TabsTrigger>
          </TabsList>
          <TabsContent value="tokens">
            <div className="flex flex-col gap-2">
              {
                tokenList.map((token) => (
                  <TokenBalanceCard key={token.token} address={address as Address} network={token.token as `eip155:${number}/${Address}`} />
                ))
              }
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
  )
}

const tokenList = [
  {
    token: "eip155:11155111/0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  },
  {
    token: "eip155:84532/0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  },
  {
    token: "eip155:421614/0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  },
  {
    token: "eip155:1001/0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  },
]

interface BalanceCardProps {
  address: Address;
  network: `eip155:${number}/${Address}`;
}

function TokenBalanceCard({ address, network }: BalanceCardProps) {
  // Use the hook unconditionally, but pass undefined if it's not the ETH address
  const { data: nativeBalance } = useBalance({ 
    address: network.split(':')[1].split('/')[1] === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" ? address : undefined,
    chainId: parseInt(network.split(':')[1].split('/')[0]),
  });

  const { data: tokenData } = useReadContracts({
    contracts: [
      {
        address: network.split(':')[1].split('/')[1] as Address,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address],
        chainId: parseInt(network.split(':')[1].split('/')[0]),
      },
      {
        address: network.split(':')[1].split('/')[1] as Address,
        abi: erc20Abi,
        functionName: "symbol",
        args: [],
        chainId: parseInt(network.split(':')[1].split('/')[0]),
      },
      {
        address: network.split(':')[1].split('/')[1] as Address,
        abi: erc20Abi,
        functionName: "decimals",
        args: [],
        chainId: parseInt(network.split(':')[1].split('/')[0]),
      },
      {
        address: network.split(':')[1].split('/')[1] as Address,
        abi: erc20Abi,
        functionName: "name",
        args: [],
        chainId: parseInt(network.split(':')[1].split('/')[0]),
      },
    ],
  });

  if (network.split(':')[1].split('/')[1] === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE") {
    return (
      <div className="flex flex-row gap-3">
        <Image src="/logos/eth.svg" alt="eth" width={40} height={40} />
        <div className="flex flex-col items-start">
          <p className="text-md">Ether</p>
          <p className="text-md">{formatEther(nativeBalance?.value as bigint)}</p>
        </div>
      </div>
    )
  } else {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2 items-center">
          <Image src="/logos/eth.svg" alt="eth" width={24} height={24} />
          <p className="text-lg">{tokenData?.[1]?.result}</p>
        </div>
        <p className="text-2xl">{formatUnits(tokenData?.[0]?.result as bigint, tokenData?.[2]?.result as number)}</p>
      </div>
    )
  }
}