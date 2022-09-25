import React, { useEffect, useState } from "react";

interface IProps extends React.HTMLAttributes<HTMLParagraphElement> {
  value: number;
  rate: number;
  timeout?: number;
  decimalPlaces?: number;
}

const RunningBalance: React.FC<IProps> = ({
  value,
  rate,
  timeout = 100,
  decimalPlaces = 6,
  ...props
}) => {
  const [valueShow, setValueShow] = useState(value);
  useEffect(() => {
    setValueShow(value);
    const id = setInterval(() => {
      setValueShow((currValue) => {
        return currValue + rate / (1000 / timeout);
      });
    }, timeout);
    return () => {
      clearInterval(id);
    };
  }, [value, rate]);
  return <p {...props}><img
  src="https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=022"
  alt="USDC logo"
  width={28}
  height={28}
/> {valueShow.toFixed(decimalPlaces)}</p>;
};

export default RunningBalance;
