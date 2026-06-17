import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Implementasi ringan dari Radix `Slot`: merender child tunggal sambil
 * menggabungkan props (terutama className) dari parent ke child tersebut.
 * Cukup untuk pola `<Button asChild><Link/></Button>`.
 */
export interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

export const Slot = React.forwardRef<HTMLElement, SlotProps>(
  ({ children, className, ...props }, ref) => {
    if (!React.isValidElement(children)) {
      return null;
    }
    const child = children as React.ReactElement<any>;
    return React.cloneElement(child, {
      ...props,
      ...child.props,
      className: cn(className, child.props?.className),
      ref,
    });
  }
);
Slot.displayName = "Slot";
