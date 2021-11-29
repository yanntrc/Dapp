import { useState, useEffect } from 'react';
import { ethers } from 'ethers'
import './App.css';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'

const greeterAddress = '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512'

function App() {

  useEffect(() => {
    fetchGreeting()
  }, [])
  const [greeting, setGreetingValue] = useState()

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
  }

  async function fetchGreeting() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)
      try {
        const data = await contract.greet()
        setGreetingValue(data)
      } catch (err) {
        console.log(err)
      }
    }
  }

  async function setGreeting() {
    if (!greeting) return
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
      const transaction = await contract.setGreeting(greeting)
      setGreetingValue('')
      await transaction.wait()
      fetchGreeting()
    }
  }

  return (
    <div className="App">
      <p>{greeting}</p>
      <input onChange={e => setGreetingValue(e.target.value)} placeholder="set greeting" />
      <button onClick={setGreeting}>Set Greeting</button>
    </div>
  );
}

export default App;
