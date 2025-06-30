import React from'react'
import RaceHeader from './components/RaceHeader'
import Track from './components/Track'
import DriverRank from './components/DriverRank'
import RaceInfo from './components/RaceInfo'
import Footer from './components/Footer'
import { useEffect,useState} from 'react'

function App() {
  const year = new Date().getFullYear();
  const [circuitKey, setCircuitKey] = useState(0);
  useEffect(()=>{
    fetch("https://api.openf1.org/v1/sessions?session_key=latest")
      .then(res=>res.json())
      .then(data=>{setCircuitKey(data[0]["circuit_key"]);})

  },[])

  return (
    <>
      <RaceHeader />
      <div style={{display:'flex'}}>
        <div style={{flex:4}}>
          <DriverRank />
        </div>
        <div style={{flex:1}}>
          <Track circuitKey={circuitKey} year={year}/>
          <RaceInfo />
        </div>
      </div>

      <Footer />

    </>
  )
}

export default App
