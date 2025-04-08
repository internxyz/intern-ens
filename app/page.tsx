import WalletHeader from "@/components/walletHeader";
import WalletOnboarding from "@/components/wallet-onboarding";
export default function Home() {
  return (
    <div className="flex flex-col gap-4 max-w-96 mx-auto">
      <WalletHeader />
      <WalletOnboarding />
    </div>
  );
}
