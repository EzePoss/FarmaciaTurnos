import * as React from "react"
import { cn } from "../../lib/utils"

const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
        <button
            className={cn(
                "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                {
                    "bg-[#00E676] text-white hover:bg-[#00E676]/90": variant === "default",
                    "border border-[#00E676] text-[#00E676] hover:bg-[#00E676]/10": variant === "outline",
                },
                {
                    "h-10 px-4 py-2": size === "default",
                },
                className
            )}
            ref={ref}
            {...props}
        />
    )
})
Button.displayName = "Button"

export { Button }