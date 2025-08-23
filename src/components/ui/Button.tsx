import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "icon" | "small";
}

const Button: React.FC<ButtonProps> = ({
  variant = "default",
  size = "default",
  className = "",
  children,
  ...props
}) => {
  let baseStyles = "flex items-center justify-center rounded-lg font-medium transition duration-200 focus:outline-none";
  let variantStyles = "";
  let sizeStyles = "";

  if (variant === "default") variantStyles = "bg-blue-600 text-white hover:bg-blue-700";
  if (variant === "outline") variantStyles = "border border-gray-300 text-gray-700 hover:bg-gray-100";
  if (variant === "ghost") variantStyles = "text-gray-700 hover:bg-gray-200";

  if (size === "icon") sizeStyles = "w-10 h-10 p-2";
  if (size === "small") sizeStyles = "px-3 py-1 text-sm";
  if (size === "default") sizeStyles = "px-4 py-2";

  return (
    <button className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
