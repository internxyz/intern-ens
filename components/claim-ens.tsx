"use client"

import { useState, useEffect } from "react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogNested,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerNested,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerDescription,
} from "@/components/ui/drawer";
import { IdCard } from 'lucide-react';

export default function ClaimEns() {

  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <div>
        Placeholder for claim ENS
      </div>
    )
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="secondary">
          <IdCard />
          Get a free domain name
        </Button>
      </DrawerTrigger> 
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            Get a free domain name
          </DrawerTitle>
          <DrawerDescription>
            Claim your free domain name
          </DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  )
}