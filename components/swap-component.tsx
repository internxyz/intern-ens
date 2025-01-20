"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button";
import { Settings, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function CryptoSwap() {
  const [sellAmount, setSellAmount] = useState("")
  const [buyAmount, setBuyAmount] = useState("")

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
            <div className="text-muted-foreground text-xl">Sell</div>
            <div className="flex flex-row items-center justify-between">
              <input
                type="text"
                value={sellAmount}
                onChange={(e) => setSellAmount(e.target.value)}
                placeholder="0"
                className="bg-transparent text-4xl outline-none w-full"
              />
              <div className="flex flex-col items-end gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <div className="w-6 h-6 rounded-full bg-blue-500 mr-2" />
                      ETH
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>ETH</DropdownMenuItem>
                    <DropdownMenuItem>WETH</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="flex flex-row items-center justify-between">
              <div className="text-muted-foreground">$0</div>
              <div className="flex flex-row items-center gap-2">
                <div className="text-muted-foreground">0.0002 ETH</div>
                <Button variant="secondary" size="sm">Max</Button>
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
          <div className="flex flex-col gap-2 rounded-2xl p-4 border-2 border-muted">
            <div className="text-muted-foreground text-xl">Buy</div>
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
                      <div className="w-6 h-6 rounded-full bg-blue-500 mr-2" />
                      USDC
                      <ChevronDown className="ml-2 h-4 w-4" />
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
            className="w-full rounded-2xl h-14 text-lg mt-2"
            disabled={!sellAmount || !buyAmount}
          >
            Enter an amount
          </Button>
        </div>
      </div>
    </div>
  )
}

