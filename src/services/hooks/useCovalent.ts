import axios from 'axios'

export function useCovalent() {

  const API_KEY = process.env.NEXT_PUBLIC_COVALENT_KEY
  const chainId = 80001; //matic-mumbai 

  const getNFTTokenIdsForContract = async (contractAddress: string) => {
    const response = await axios.get(`https://api.covalenthq.com/v1/${chainId}/tokens/${contractAddress}/nft_token_ids/?&key=${API_KEY}`, {
      headers: {
        'content-type': 'application/json',
      }
    })
    console.log(response.data.data.items)
    return response.data
  }

  const getNFTTransactionsForContract = async (contractAddress: string, tokenId: string) => {
    const response = await axios.get(`https://api.covalenthq.com/v1/${chainId}/tokens/${contractAddress}/nft_transactions/${tokenId}/?&key=${API_KEY}`, {
      headers: {
        'content-type': 'application/json',
      }
    })
    console.log(response.data.data.items)
    return response.data
  }

  const getNFTExternalMetadataForContract = async (contractAddress: string, tokenId: string) => {
    const response = await axios.get(`https://api.covalenthq.com/v1/${chainId}/tokens/${contractAddress}/nft_metadata/${tokenId}/?&key=${API_KEY}`, {
      headers: {
        'content-type': 'application/json',
      }
    })
    console.log(response.data.data.items)
    return response.data
  }


  return {
    getNFTTokenIdsForContract,
    getNFTTransactionsForContract,
    getNFTExternalMetadataForContract
  }
}