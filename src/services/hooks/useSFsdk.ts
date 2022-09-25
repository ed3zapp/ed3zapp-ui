import SuperfluidSDK from "@superfluid-finance/js-sdk";
import { Web3Provider } from "@ethersproject/providers";
import { CONTRACT_ADDRESS } from "../usdcx_contract";
import { ethers } from "ethers";
import { USDC_ABI } from "../../configs/abis/USDC";
import { USDCX_ABI } from "../../configs/abis/USDCx";
import { Framework } from "@superfluid-finance/sdk-core";
import { customHttpProvider } from "../ethers-service";

//Workaround for using window.ethereum
declare var window: any
// Contracts:
const fUSDCx = CONTRACT_ADDRESS;

//Polygon Testnet contract address
const fUSDC_contract_address = "0xbe49ac1EadAc65dccf204D4Df81d650B50122aB2";
const fUSDCx_contract_address = "0x42bb40bF79730451B11f6De1CbA222F17b87Afd7";

//Init sf framework
const init = async (s: string, r?: string) => {
  console.log("Inside SuperFluid Init Hook, provider:");
  const sf = new SuperfluidSDK.Framework({
    ethers: new Web3Provider(window.ethereum),
    tokens: ["fUSDC"],
  });
  await sf.initialize();

  const sender = sf.user({
    address: s,
    token: fUSDCx,
  });

  let receiver: SuperfluidSDK.User;
  if (r) {
    receiver = sf.user({
      address: r,
      token: fUSDCx,
    });
  }

  return { sender, receiver };
};

export const getUSDCBalances = async (provider, address) => {
  // Signing the transaction
  const signer = provider.getSigner(address);

  // Create a contract instance that we can interact with
  const USDC = new ethers.Contract(fUSDC_contract_address, USDC_ABI, signer);

  // Create a contract instance that we can interact with
  const USDCx = new ethers.Contract(fUSDCx_contract_address, USDCX_ABI, signer);

  // Get the current value of the token
  const USDCBalance = await USDC.balanceOf(address);
  const USDCxBalance = await USDCx.balanceOf(address);
  return {
    USDCBalance: ethers.utils.formatEther(USDCBalance),
    USDCxBalance: ethers.utils.formatEther(USDCxBalance),
  };
};

export const flowDetails = async (s) => {
  console.log("Inside SuperFluid flowDetails Hook:" + s);
  const { sender } = await init(s);
  const details = await sender.details();
  console.log("Inside SuperFluid flowDetails Hook, details: " + details);
  return details;
};

  //where the Superfluid logic takes place
 export const createFlow = async (
    recipient,
    amount
  ) => 
  {
  const sf = await Framework.create({
    networkName: "mumbai",
    provider: customHttpProvider
  });

  const signer = sf.createSigner({

    // Kalvi USDCx wallet private Key
    privateKey:
      "1b8239b0e7ab46ec2b0a9b3fc9d93aaebdac37a55a06bc6b7863f4b4329a5e1e",
    provider: customHttpProvider
  });

  const calculatedFlowRate = calculateFlowRate(amount);

  //const DAIx = "0xe3cb950cb164a31c66e32c320a800d477019dcff";
  //Polygon Mumbai testnet
  const USDCx = "0x42bb40bF79730451B11f6De1CbA222F17b87Afd7";
  try {
    const createFlowOperation = sf.cfaV1.createFlow({
      flowRate: calculatedFlowRate.toString(),
      //flowRate: "20000000000000", 
      receiver: recipient,
      superToken: USDCx
    });

    console.log("Creating your stream...");

    const result = await createFlowOperation.exec(signer);
    console.log(result);

    console.log(
      `Congrats - you've just created a money stream!
    View Your Stream At: https://app.superfluid.finance/dashboard/${recipient}
    Network: Matic Mumbai
    Super Token: USDCx
    Sender: 0xDCB45e4f6762C3D7C61a00e96Fb94ADb7Cf27721
    Receiver: ${recipient},
    FlowRate: ${calculatedFlowRate}
    `
    );
  } catch (error) {
    console.log(
      "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
    );
    console.error(error);
  }
}

//Invoke if the flow already exist and update the flow rate
export const updateFlow = async (
  recipient,
  amount
) => 
{
const sf = await Framework.create({
  networkName: "mumbai",
  provider: customHttpProvider
});

const signer = sf.createSigner({
  privateKey:
    "1b8239b0e7ab46ec2b0a9b3fc9d93aaebdac37a55a06bc6b7863f4b4329a5e1e",
  provider: customHttpProvider
});

const calculatedFlowRate = calculateFlowRate(amount);

//const DAIx = "0xe3cb950cb164a31c66e32c320a800d477019dcff";
//Polygon Mumbai testnet
const USDCx = "0x42bb40bF79730451B11f6De1CbA222F17b87Afd7";
try {
  const createFlowOperation = sf.cfaV1.updateFlow({
    flowRate: calculatedFlowRate.toString(),
    //flowRate: "20000000000000", 
    receiver: recipient,
    superToken: USDCx
  });

  console.log("Updating your stream...");

  const result = await createFlowOperation.exec(signer);
  console.log("update stream result: " + result);

  console.log(
    `Congrats - you've just created a money stream!
  View Your Stream At: https://app.superfluid.finance/dashboard/${recipient}
  Network: Matic Mumbai
  Super Token: USDCx
  Sender: 0xDCB45e4f6762C3D7C61a00e96Fb94ADb7Cf27721
  Receiver: ${recipient},
  FlowRate: ${calculatedFlowRate}
  `
  );
} catch (error) {
  console.log(
    "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
  );
  console.error(error);
}
}

const ALLOWANCE_DAYS = 30;

function calculateFlowRate(amountInEther) {
  if (
    typeof Number(amountInEther) !== "number" ||
    isNaN(Number(amountInEther)) === true
  ) {
    throw new Error("You can only calculate a flowRate based on a number");
  } else if (typeof Number(amountInEther) === "number") {
    const monthlyAmount = ethers.utils.parseEther(amountInEther.toString());
    console.log("monthlyAmount: "+monthlyAmount);
    const calculatedFlowRate = Math.floor(
      (monthlyAmount as any) / 3600 / 24 / ALLOWANCE_DAYS
    );
    console.log("calculatedFlowRate: ",calculatedFlowRate);
    return calculatedFlowRate;
  }
}


export const unWrapToken = async (amount, provider, address) => {
  const sf = await Framework.create({
    networkName: "mumbai",
    provider: customHttpProvider,
  });

  // Signing the transaction
  const signer = provider.getSigner(address);

  // Convert the amount to wei
  const convertedAmount = ethers.utils.parseEther(amount.toString());

  // Create a contract instance that we can interact with
  const usdcx = await sf.loadSuperToken(CONTRACT_ADDRESS);

  // Downgrade the USDCx token to USDC
  const usdcDowngrade = await usdcx.downgrade({
    amount: convertedAmount.toString(),
  });

  // Wait for the transaction to be mined
  let usdcDowngradeReceipt = await usdcDowngrade.exec(signer);
  await usdcDowngradeReceipt.wait();

  const newBalances = await getUSDCBalances(provider, address);
  return { newBalances };
};
