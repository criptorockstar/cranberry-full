import * as React from "react";
import { Input as ShadcnInput } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  password?: boolean;
  className?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ error, password = false, className, type = "text", ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const toggleShowPassword = () => {
      setShowPassword((prev) => !prev);
    };

    return (
      <div className="relative mb-6">
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
        {error && <p className="absolute text-xs text-red-500 mt-1">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
