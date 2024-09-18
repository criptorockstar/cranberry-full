import * as React from "react";
import { Input as ShadcnInput } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, LucidePlus, LucideMinus } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  password?: boolean;
  className?: string;
  isNumeric?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ error, password = false, isNumeric = false, className, type = "text", ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [numericValue, setNumericValue] = React.useState<number>(1); // State for numeric input value

    const toggleShowPassword = () => {
      setShowPassword((prev) => !prev);
    };

    // Increment and Decrement Handlers for numeric input
    const increment = () => setNumericValue((prev) => prev + 1);
    const decrement = () => setNumericValue((prev) => (prev > 1 ? prev - 1 : prev));

    return (
      <div className="relative mb-6">
        {isNumeric ? (
          <div className="flex items-center">
            {/* Decrement Button */}
            <div
              onClick={decrement}
              className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer"
              style={{ top: "50%", transform: "translateY(-50%)" }}
            >
              <LucideMinus className="w-4 h-4" />
            </div>

            {/* Numeric Input */}
            <ShadcnInput
              type="text"
              className={cn(
                "h-11 w-full text-center border-l-0 border-r-0 border border-black px-10",
                className
              )}
              value={numericValue}
              onChange={(e) => setNumericValue(Number(e.target.value))}
              ref={ref}
              {...props}
            />

            {/* Increment Button */}
            <div
              onClick={increment}
              className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
              style={{ top: "50%", transform: "translateY(-50%)" }}
            >
              <LucidePlus className="w-4 h-4" />
            </div>
          </div>
        ) : (
          <>
            {/* Regular or Password Input */}
            <ShadcnInput
              type={password ? (showPassword ? "text" : "password") : type}
              className={cn(
                "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                password && "pr-10",
                className,
              )}
              ref={ref}
              {...props}
            />

            {/* Toggle Password Visibility */}
            {password && (
              <div
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                style={{ top: "50%", transform: "translateY(-50%)" }}
                onClick={toggleShowPassword}
              >
                {showPassword ? (
                  <Eye className="text-muted-foreground" />
                ) : (
                  <EyeOff className="text-muted-foreground" />
                )}
              </div>
            )}
          </>
        )}

        {/* Error Message */}
        {error && <p className="absolute text-xs text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
