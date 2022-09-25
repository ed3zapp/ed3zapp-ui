import axios from 'axios';

export async function mintNFT(wallet, name, desc, imgURL) {
    try {
    const urlToMint = "https://api.nftport.xyz/v0/mints/easy/urls";

    const body = {
      "chain": "rinkeby",
      "name": name,
      "description": desc,
      "file_url": imgURL,
      "mint_to_address": wallet
    };

    const auth = {
        headers: {
          Authorization: getAccessToken()
        }
    };

    const res = await axios.post(urlToMint, body, auth);
    console.log("Response data: " + res.data);
    return res.data.transaction_external_url;
    } catch (error) {
        console.log("Error minting NFT: " + error)
    }
  }

  export function getAccessToken() {
    return process.env.NFT_PORT_API_KEY
  }