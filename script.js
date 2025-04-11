
const urlParams = new URLSearchParams(window.location.search);
const item = urlParams.get("item") || "Unknown Item";
const price = urlParams.get("price") || "0";

document.getElementById("itemName").innerText = `${item.replace(/-/g, " ")} — APE IN`;
document.getElementById("priceTag").innerText = `BAX ${price}`;
document.getElementById("buyBtn").innerText = `Confirm & Pay ${price} BAX`;

document.getElementById("buyBtn").addEventListener("click", async () => {
  const status = document.getElementById("status");
  if (typeof window.ethereum === "undefined") {
    status.innerText = "❌ Please install MetaMask!";
    return;
  }
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  const tokenAddress = "0xFeB3c88a887267D4dFbDF5f9A9f063ba334279dC";
  const tokenAbi = ["function transfer(address to, uint amount) returns (bool)"];
  const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);
  try {
    const amount = ethers.utils.parseUnits(price, 18);
    const tx = await tokenContract.transfer("0x961f3734a90326128156FFeC622F858941f8982d", amount);
    status.innerText = `✅ Payment successful! TX: ${tx.hash}`;
  } catch (err) {
    status.innerText = `❌ Transaction failed: ${err.message}`;
  }
});
