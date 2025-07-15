import Link from "next/link";
import Image from "next/image";

import { SheetMentu } from "../sidebar/sheet-menu";
import { UserButton } from "@clerk/nextjs";

interface Props {
    children: React.ReactNode;
    navChildren: React.ReactNode;
}

export const ContentLayout = ({ children, navChildren }: Props) => {
    return (
        <div className="min-h-screen bg-gray-900">
            <header className="flex justify-between h-16 pr-4 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 sticky top-0 left-0 z-40 bg-gray-800 border-b border-gray-700 shadow-sm">
                <div className="flex items-center gap-2 px-4">
                    <SheetMentu />
                    <Link href="/user" className="flex md:hidden items-center gap-2">
                        <Image
                            src="/logo.svg"
                            alt="Logo"
                            width={24}
                            height={24}
                        />
                    </Link>
                    {navChildren}
                </div>

                <UserButton fallback="/" />
            </header>

            <main className="p-4">
                {children}
            </main>
        </div>
    )
}
