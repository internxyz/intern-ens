import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

export default function WalletHeader() {
  return (
    <div className="flex flex-row justify-between items-center">
      <h1>Intern</h1>
      <Button size="icon" variant="secondary">
        <Lock className="w-4 h-4" />
      </Button>
    </div>
  );
}