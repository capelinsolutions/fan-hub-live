import { cn } from "@/lib/utils";

interface AvatarProps {
  initials: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = {
  sm: "h-10 w-10 text-sm",
  md: "h-14 w-14 text-base",
  lg: "h-20 w-20 text-xl",
  xl: "h-28 w-28 text-3xl",
};

export function Avatar({ initials, size = "md", className }: AvatarProps) {
  return (
    <div
      className={cn(
        "pitch-gradient flex items-center justify-center rounded-full font-bold text-primary-foreground shadow-lg ring-2 ring-pitch-glow/30",
        sizes[size],
        className,
      )}
    >
      {initials}
    </div>
  );
}
