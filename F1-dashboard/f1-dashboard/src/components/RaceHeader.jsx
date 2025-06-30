import React, { use, useEffect, useState } from "react";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import Flag from "./Flag";

countries.registerLocale(enLocale);

function RaceHeader(){
    const [circuitName, setCircuitName] = useState("circuit");
    const [countryName, setCountryName] = useState("loading");
    const [countryCode, setCountryCode] = useState("") 
    const [sessionKey, setSessionKey] = useState("");

    const [flag, setFlag] = useState("🏁");
    const [date, setDate] = useState("date");
    const [time, setTime] = useState("00:00:00");
    const [weather, setWeather] = useState("weather");
    const [trackStatus, setTrackStatus] = useState("trackStatus");
    const [lap, setLap] = useState("currentlap");
    const [totalLaps, settotalLaps] = useState(0)
    const [statusTag, setStatusTag] = useState("statusTag");

    const circuitLapsMap = {
      "Albert Park": 58,
      "Baku City Circuit": 51,
      "Sakhir": 57,
      "Catalunya": 66,
      "Monaco": 78,
      "Circuit Gilles Villeneuve": 70,
      "Circuit of the Americas": 56,
      "Hungaroring": 70,
      "Interlagos": 71,
      "Jeddah": 50,
      "Las Vegas Street Circuit": 50,
      "Lusail International Circuit": 57,
      "Marina Bay Street Circuit": 62,
      "Miami International Autodrome": 57,
      "Monza": 53,
      "Red Bull Ring": 71,
      "Silverstone Circuit": 52,
      "Spa-Francorchamps": 44,
      "Suzuka": 53,
      "Yas Marina Circuit": 58,
      "Zandvoort": 72,
      "Shanghai International Circuit": 56,
      "Imola": 63,
      "Sochi Autodrom": 53,
      "Nürburgring": 60,
      "Sepang International Circuit": 56,
      "Indianapolis": 73,
      "Hockenheimring": 67,
      "Magny-Cours": 70
    };

      // 国家名 ➜ 时区映射（常见赛道国家）
  const countryTimezones = {
    "Australia": "Australia/Melbourne",
    "Azerbaijan": "Asia/Baku",
    "Bahrain": "Asia/Bahrain",
    "Spain": "Europe/Madrid",
    "Monaco": "Europe/Monaco",
    "Canada": "America/Toronto",
    "United States": "America/New_York",
    "Hungary": "Europe/Budapest",
    "Brazil": "America/Sao_Paulo",
    "Saudi Arabia": "Asia/Riyadh",
    "Qatar": "Asia/Qatar",
    "Singapore": "Asia/Singapore",
    "Italy": "Europe/Rome",
    "Austria": "Europe/Vienna",
    "United Kingdom": "Europe/London",
    "Belgium": "Europe/Brussels",
    "Japan": "Asia/Tokyo",
    "Netherlands": "Europe/Amsterdam",
    "China": "Asia/Shanghai",
    "Russia": "Europe/Moscow",
    "Germany": "Europe/Berlin",
    "Malaysia": "Asia/Kuala_Lumpur",
    "France": "Europe/Paris",
    "United Arab Emirates": "Asia/Dubai",
  };

  const getTimeZoneByCountry = (name) => {
    return countryTimezones[name] || "UTC"; // fallback
  };


    useEffect(() => {
        const fetchLatestRace = async () => {
          try {
            const res = await fetch("https://api.openf1.org/v1/sessions?session_name=Race");
            const data = await res.json();
    
            const now = new Date();
    
            // 筛选已结束（date_end < now）且有 country 信息的比赛
            const pastRaces = data
              .filter((session) => new Date(session.date_end) < now && session.country_code)
              .sort((a, b) => new Date(b.date_end) - new Date(a.date_end)); // 按结束时间倒序
    
            if (pastRaces.length > 0) {
              const latest = pastRaces[0];
              setCircuitName(latest.circuit_short_name);
              setCountryName(latest.country_name);
              setFlag(getFlagEmoji(latest.country_code));
              setSessionKey(latest.session_key);
              settotalLaps(circuitLapsMap[latest.circuit_short_name])

              // 自动转换三位国家码 ➜ 两位国家码
              const code2 = countries.alpha3ToAlpha2(latest.country_code);
              if (code2){ setCountryCode(code2.toLowerCase());console.log(latest.country_code)}
    
            }
          } catch (err) {
            console.error("Failed to fetch race session:", err);
          }
        };
    
        fetchLatestRace();
      }, []);


      useEffect(() => {
        const fetchRaceWeather = async () => {
          try {
            const res = await fetch("https://api.openf1.org/v1/weather?meeting_key=latest&session_key=latest");
            const data = await res.json();
            const weatherData = data[0]; 
            console.log(weatherData);
      
            setWeather(
              `Track: ${weatherData.track_temperature}°C, Air: ${weatherData.air_temperature}°C, Humidity: ${weatherData.humidity}, Wind: ${weatherData.wind_speed}m/s ${weatherData.wind_direction}°`
            );
          } catch (err) {
            console.error("Failed to fetch race weather:", err);
          }
        };
      
        fetchRaceWeather();
      }, []);

      useEffect(()=>{
        if (!sessionKey) return;
        const fetchLap = async () => {
          try{
            const res = await fetch(`https://api.openf1.org/v1/laps?session_key=latest`)
              const data = await res.json();
              if(data.length>0){
                const currentLap = Math.max(...data.map((lap) => lap.lap_number));
                setLap(currentLap);
              }
          }catch(err){
            console.error("Failed to fetch lap:",err)
          }
        };
        fetchLap();
        const interval = setInterval(fetchLap, 5000); 

        return () => clearInterval(interval); 
      },[sessionKey]);

  // 实时时间更新
  useEffect(() => {
    if (!countryName) return;
    const timezone = getTimeZoneByCountry(countryName);

    const updateTime = () => {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: timezone,
        hour12: false,
      });
      setTime(formatter.format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [countryName]);
    
      const getFlagEmoji = (code) => {
        return code
          .toUpperCase()
          .split("")
          .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
          .join("");
      };


    return(
        <div className="race-header">
            <div className="race-info">
            {/* {countryCode && ( */}
          <Flag countryCode={countryName} width={70} height={35}/>

                <span className="race-name">{circuitName}</span>
                <span className="country">{countryName}</span>
                <span className="status">Race</span>
                <span className="time">{time}</span>
            </div>
            <div className="weather-info">
                <span>{weather}</span>
            </div>

            <div className="track-status">
                <span className="laps">{lap} / {totalLaps}</span>
                <span className="status-tag">Track Clear</span>
            </div>

        </div>


    )
}

export default RaceHeader;