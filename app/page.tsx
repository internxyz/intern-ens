import Image from "next/image";
import Link from "next/link";
import { Globe, AppWindowMac, File, Rocket } from 'lucide-react';

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          src="/bs-logo.svg"
          alt="Buildstation logo"
          width={180}
          height={38}
          priority
        />
        <p>Get started by checking out the demos</p>
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            <Link href="/wallet">Wallet</Link>
          </li>
          <li className="mb-2">
            <Link href="/send-transaction">Send transaction</Link>
          </li>
          <li className="mb-2">
            <Link href="/write-contract">Write contract</Link>
          </li>
          <li className="mb-2">
            <Link href="/mint-redeem-lst-bifrost">Mint/Redeem LST Bifrost</Link>
          </li>
        </ol>
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="https://github.com/buildstationorg/ethui"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Rocket className="w-4 h-4" />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="https://github.com/buildstationorg/ethui/tree/main/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </div>
      <footer className="row-start-3 flex flex-col gap-4">
        <div className="flex gap-6 flex-wrap items-center justify-center">
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://github.com/buildstationorg/ethui/tree/main/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            <File className="w-4 h-4" />
            Learn
          </a>
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://github.com/buildstationorg/ethui/tree/main/components"
            target="_blank"
            rel="noopener noreferrer"
          >
            <AppWindowMac className="w-4 h-4" />
            Components
          </a>
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://openguild.wtf"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Globe className="w-4 h-4" />
            Go to buildstation.org →
          </a>
        </div>
      </footer>
    </div>
  );
}
