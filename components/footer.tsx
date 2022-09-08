import React from "react";

const Footer: React.FC = () => {
  return (
    <div>
    <div className="flex flex-1 flex-col items-center justify-center">
        <p className="mr-1">Powered by</p>
        <div className="flex">
          <a className="mr-3 flex" href="https://polygon.technology/">
            <img src="/polygon.svg" height={60} width={135} />
          </a>
          <a className="mr-5 flex" href="https://web3auth.io/">
            <img src="/web3auth.svg" height={20} width={120} />
          </a>
          <a className="mr-5 flex" href="https://www.superfluid.finance/">
            <img src="/superfluid.svg" height={10} width={110} />
          </a>
        </div>
    </div>
    <div className="flex flex-1 flex-col items-center">
        <p className="cursor-pointer ml-8">For ETHOnline ETHGlobal hackathon</p>
        <p className="cursor-pointer ml-8">Ed3Zapp Copyright @ 2022</p>
    </div>
    </div>
  );
};

export default Footer;
