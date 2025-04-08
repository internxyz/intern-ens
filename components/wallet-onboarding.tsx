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
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex">
      <Drawer>
        <DrawerTrigger asChild>
          <Button 
            className="fixed bottom-10 left-1/2 -translate-x-1/2 w-96 max-w-[calc(100%-2rem)] mx-auto"
            size="lg"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Wallet Onboarding</DrawerTitle>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    </div>
  );
}