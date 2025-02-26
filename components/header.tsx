import BuildKit from "@/components/buildkit";

export default function Header() {
  return (
    <header className="flex flex-row justify-between items-center w-full p-4">
      <div className="text-2xl font-bold">
        EthUI
      </div>
      <BuildKit />
    </header>
  )
}