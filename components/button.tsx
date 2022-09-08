import React from "react";

interface IProps extends React.HTMLAttributes<HTMLButtonElement> {}

const Button: React.FC<IProps> = ({ className, ...props }) => (
  <button
    {...props}
    className={`bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded ${className}`}
  />
);

export default Button;
