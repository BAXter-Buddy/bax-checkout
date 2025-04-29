// Constants
const BAX_TOKEN_ADDRESS = "0xFeB3c88a887267D4dFbDF5f9A9f063ba334279dC";
const RECIPIENT_ADDRESS = "0x961f3734a90326128156FFeC622F858941f8982d";
const DECIMALS = 18;

// Populate page content from URL
window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("item") || "Unknown Item";
  const price = params.get("price") || "0";

  document.getElementById("itemName").innerText = `${slug} — APE IN`;
  document.getElementById("priceTag").innerText = `BAX ${price}`;
  document.getElementById("buyBtn").innerText = `Confirm & Pay ${price} BAX`;
});

// MetaMask connection
async function connectWallet() {
  if (typeof window.ethereum !== "undefined") {
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const account = accounts[0];
      alert("Connected: " + account);
      document.getElementById("connectWalletButton").innerText = "Wallet Connected";
      document.getElementById("connectWalletButton").disabled = true;
    } catch (error) {
      console.error(error);
      alert("Connection failed.");
    }
  } else {
    alert("MetaMask is not installed. Please install MetaMask extension!");
  }
}

document.getElementById("connectWalletButton").addEventListener("click", connectWallet);

// Confirm & Pay function
async function sendBAXPayment() {
  const params = new URLSearchParams(window.location.search);
  const price = params.get("price");
  const amount = ethers.utils.parseUnits(price, DECIMALS);

  const tokenAbi = [
    "function transfer(address to, uint256 amount) public returns (bool)"
  ];

  if (!window.ethereum) {
    alert("MetaMask not found!");
    return;
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const tokenContract = new ethers.Contract(BAX_TOKEN_ADDRESS, tokenAbi, signer);

  try {
    const tx = await tokenContract.transfer(RECIPIENT_ADDRESS, amount);
    document.getElementById("buyBtn").innerText = "Transaction Sent...";
    await tx.wait();
    document.getElementById("buyBtn").innerText = "Payment Confirmed 🎉";
  } catch (err) {
    console.error(err);
    alert("Payment failed. See console for details.");
  }
}

document.getElementById("buyBtn").addEventListener("click", sendBAXPayment);
