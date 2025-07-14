import { TRPCReactProvider } from "@/trpc/client";

interface TRPCProviderProps {
    children: React.ReactNode;
}

export const TRPCProvider = ({ children }: TRPCProviderProps) => {
    return (
        <TRPCReactProvider>
            {children}
        </TRPCReactProvider>
    )
}