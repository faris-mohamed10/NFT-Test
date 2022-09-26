import "./App.css";
import { useEffect, useState } from "react";
import contract from "./contracts/NFTCollectible.json";
import { ethers } from "ethers";
const contractAddress = "0x5022FE07bfc85E1383171cf07989e92001EcDCAb";
const abi = contract.abi;

function App() {
  //setting the account from the MetaMask
  const [currentAccount, setCurrentAccount] = useState(null);
  //Checking the MetaMask is installed in the browser
  const checkWalletIsConnected = async () => {
    const { ethereum } = window;
    //Checking the MetaMask has been injected
    if (!ethereum) {
      console.log("Make Sure you have a MetaMask wallet installed or injected");
      return;
    } else {
      console.log("Wallet exists! We're ready to go..!!");
    }
    //Finding the active Account in Wallet using ethereum.request({method :"eth_accounts"})
    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Founded an authorized account:", account);
      setCurrentAccount(account);
    } else {
      console.log("Opps..!No authorized accounts ...!!");
    }
  };
  const connectWalletHandler = async () => {
    const { ethereum } = window;
    // It attempts to request Metamask for accounts that are connected.
    // If Metamask is already connected, it obliges by giving the function a list of accounts.
    //If not an empty list is returned.
    if (!ethereum) {
      alert("Please install MetaMask wallet");
    }
    //Accesing the account
    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Found an Account ! Address of the Account is ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };
  //Minting the NFT
  const mintNftHandler = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        //If ethereum exists, it sets Metamask as the RPC provider.
        //Will be issuing requests to the miners using your Metamask wallet.
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress, abi, signer);
        //Initilizing the payment, Gets a prompt from the MetaMask to pay 0.01 ETH as the price
        console.log("Initialize payment");
        console.log(typeof currentAccount);
        let nftTxn = await nftContract.safeMint(currentAccount, 2);

        console.log("Mining... please wait");
        await nftTxn.wait();

        console.log(
          `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
        );
      } else {
        console.log("Ethereum object does not exist");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const connectWalletButton = () => {
    return (
      <button
        onClick={connectWalletHandler}
        className="cta-button connect-wallet-button"
      >
        Connect Wallet
      </button>
    );
  };
  const mintNftButton = () => {
    return (
      <button onClick={mintNftHandler} className="cta-button mint-nft-button">
        Mint My NFT
      </button>
    );
  };
  useEffect(() => {
    checkWalletIsConnected();
  }, []);
  return (
    <div className="main-app">
      <h1>Scrappy Squirrels</h1>
      <div>{currentAccount ? mintNftButton() : connectWalletButton()}</div>
    </div>
  );
}

export default App;
