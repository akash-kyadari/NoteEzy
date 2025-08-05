import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils"; // Assuming you have a utility for merging class names

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2  disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-blue-500 text-white hover:bg-blue-700",
        destructive: "bg-red-500 text-white hover:bg-red-700",
        outline:
          "border border-text-light bg-transparent hover:bg-primary hover:text-black text-text-dark",
        ghost: "hover:bg-gray-100 text-text-dark",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = ({ className, variant, size, ...props }) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
};

export default Button;
