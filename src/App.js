import "./App.css";
import { useEffect, useState } from "react";
import contract from "./contracts/NFTCollectible.json";
import { ethers } from "ethers";
const contractAddress = "0x6dfE505e9Ecf24d534B581dc157288b708b0669d";
const abi = contract.abi;

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const checkWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make Sure you have a MetaMask wallet installed or injected");
      return;
    } else {
      console.log("Wallet exists! We're ready to go..!!");
    }

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

    if (!ethereum) {
      alert("Please install MetaMask wallet");
    }
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

  const mintNftHandler = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress, abi, signer);

        console.log("Initialize payment");
        let nftTxn = await nftContract.mintNFTs(1, {
          value: ethers.utils.parseEther("0.01"),
        });

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
