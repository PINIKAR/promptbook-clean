import logo from "@/assets/logo.png";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Logo = ({ size = "md", className = "" }: LogoProps) => {
  const sizeClasses = {
    sm: "h-12 w-auto",
    md: "h-16 w-auto md:h-20",
    lg: "h-28 w-auto md:h-36",
  };

  return (
    <img
      src={logo}
      alt="לוגו לב-לבינה - אמיתות בין קווים פלאיות"
      className={`${sizeClasses[size]} ${className} object-contain`}
      loading="eager"
      width={size === "sm" ? 48 : size === "md" ? 80 : 144}
      height={size === "sm" ? 48 : size === "md" ? 80 : 144}
    />
  );
};

export default Logo;
