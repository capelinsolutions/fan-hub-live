import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  withBottomNav?: boolean;
}

export function ScreenContainer({ children, className, withBottomNav }: Props) {
  return (
    <div
      className={cn(
        "mx-auto flex min-h-screen w-full max-w-[480px] flex-col safe-top",
        withBottomNav ? "pb-24" : "safe-bottom",
        className,
      )}
    >
      {children}
    </div>
  );
}
