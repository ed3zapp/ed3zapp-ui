import React from "react";
import Image, { ImageProps } from "next/image";

const LogoNavbar: React.FC<Omit<ImageProps, "src" | "alt">> = ({
  width = 160,
  height = 50,
  ...props
}) => {
  return (
    <Image
      {...props}
      src="/ed3zapp.jpg"
      alt="Ed3Zapp"
      width={width}
      height={height}
    />
  );
};

export default LogoNavbar;
