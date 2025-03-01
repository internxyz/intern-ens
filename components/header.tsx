import SigpassKit from "@/components/sigpasskit";
import Image from "next/image";

export default function Header() {
  return (
    <header className="flex flex-col gap-4 md:flex md:flex-row md:justify-between md:items-end w-full p-4">
      <div className="flex flex-row items-center">
        <Image
          src="/bs-logo.svg"
          alt="Buildstation logo"
          width={180}
          height={38}
          priority
        />
        <p className="text-2xl font-bold">/ EthUI</p>
      </div>
      <div className="place-self-end">
        <SigpassKit />
      </div>
    </header>
  )
}