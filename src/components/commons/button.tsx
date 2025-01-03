import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  className?: string;
};

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  size = "medium",
  disabled = false,
  className = "",
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary:
      "bg-primary text-white hover:bg-primary/90 focus:ring-primary disabled:bg-gray-400 disabled:cursor-not-allowed",
    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400 disabled:bg-gray-300 disabled:cursor-not-allowed",
    outline:
      "border border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary disabled:border-gray-400 disabled:text-gray-400 disabled:cursor-not-allowed",
  };
  const sizes = {
    small: "px-3 py-1 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
