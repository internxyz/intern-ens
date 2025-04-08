import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';

export default function WalletOnboarding() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="secondary">
          <Plus className="w-4 h-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Wallet Onboarding</DrawerTitle>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}