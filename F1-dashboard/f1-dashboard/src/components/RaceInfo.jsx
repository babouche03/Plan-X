import { useEffect, useState } from "react";

function RaceInfo(){
    const [RaceInfo,setRaceInfo] = useState("info")
    const [lap,setlap] = useState("unkownlap")
    const [time, setTime] = useState("0:00")

    useEffect(()=>{
        const fetchRaceInfo = async() => {
            try{
                const res = await fetch(`https://api.openf1.org/v1/race_control?session_key=latest`);
                const data = await res.json();
                console.log(data);
                setRaceInfo(data[0].message)
                setlap(data[0].lap_number)
                setTime(data[0].date)
                
            }catch(err){
                console.error("Failed to fetch race info:", err);
            }
        }
        fetchRaceInfo();
    },[])
    return(
        <>
            <h2 style={{color: "white"}}>Race Control</h2>
            <p style={{color: "gray"}}>LAP: {lap} {time} </p>
            <p style={{color: "white"}}>{RaceInfo}</p>

        </>
    )
}

export default RaceInfo;
