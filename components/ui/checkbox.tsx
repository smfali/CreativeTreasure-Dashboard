import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { className, style, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      type="checkbox"
      style={{ accentColor: "rgb(var(--accent))", ...style }}
      className={cn(
        "h-4 w-4 cursor-pointer rounded border border-input focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
});
