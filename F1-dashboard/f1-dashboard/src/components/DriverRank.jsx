import React, { useEffect, useState } from 'react';

const DriverRank = () => {
  const [drivers, setDrivers] = useState([]);

  const formatLapTime = (sec)=>{
    const min = Math.floor(sec/60);
    const second = (sec % 60).toFixed(3).padStart(6,'0');
    const formatTime = `${min}:${second}`
    return formatTime;
  }
  
  const fetchData = async () => {
    try {
      const sessionsRes = await fetch('https://api.openf1.org/v1/sessions?session_key=latest');
      const sessions = await sessionsRes.json();
      if (!sessions.length) return;
      const currentSession = sessions[0];
      // const meetingKey = currentSession.meeting_key;
      // const sessionKey = currentSession.session_key;

      const [driversRes, lapsRes, tyresRes, positionRes, intervalRes] = await Promise.all([
        fetch(`https://api.openf1.org/v1/drivers?session_key=latest`),
        fetch(`https://api.openf1.org/v1/laps?session_key=latest`),
        fetch(`https://api.openf1.org/v1/stints?session_key=latest`),
        fetch(`https://api.openf1.org/v1/position?meeting_key=latest`),
        fetch(`https://api.openf1.org/v1/intervals?session_key=latest`)
      ]);
    //   const [driversRes, lapsRes, tyresRes] = await Promise.all([
    //     fetch('https://api.openf1.org/v1/drivers'),
    //     fetch(`https://api.openf1.org/v1/laps?meeting_key=${meetingKey}&session_key=${sessionKey}`),
    //     fetch(`https://api.openf1.org/v1/tyres?meeting_key=${meetingKey}&session_key=${sessionKey}`)
    //   ]);

      const [driversData, lapsData, tyresData, positionData, intervalData] = await Promise.all([
        driversRes.json(),
        lapsRes.json(),
        tyresRes.json(),
        positionRes.json(),
        intervalRes.json()
      ]);

      // 获取每位车手的最新位置
      const latestPositions = {};
      positionData.forEach(pos => {
        latestPositions[pos.driver_number] = pos.position;
      });

      // 获取每位车手与领先者的时间差
      const latestIntervals = {};
      intervalData.forEach(interval => {
        latestIntervals[interval.driver_number] = interval.gap_to_leader;
      });

      // 整合数据
      const driverInfo = driversData.map(driver => {
        const driverLaps = lapsData.filter(lap => lap.driver_number === driver.driver_number);
        const latestLap = driverLaps.at(-1); 
        const driverTyres = tyresData.filter(t => t.driver_number === driver.driver_number);
        const latestTyre = driverTyres.at(-1);
        const fastestLap = driverLaps.reduce((fastest, current) => {
          return current.lap_duration < fastest.lap_duration ? current : fastest;
        }, driverLaps[0]);
        
        

        return {
          number: driver.driver_number,
          name: driver.name_acronym,
          team: driver.team_name,
          team_colour: driver.team_colour,
          // lapTime: latestLap && latestLap.lap_duration != null ? latestLap.lap_duration.toFixed(3) : '--',
          lapTime: latestLap && latestLap.lap_duration != null ? formatLapTime(latestLap.lap_duration) : '--',
          fastestLap: fastestLap && fastestLap.lap_duration != null ? fastestLap.lap_duration.toFixed(3) : '--',
          tyre: latestTyre ? latestTyre.compound : '未知',
          position: latestPositions[driver.driver_number] || 99,
          interval: latestIntervals[driver.driver_number] || '--'
        };
      });
    
    driverInfo.sort((a, b) => a.position - b.position);
  
    setDrivers(driverInfo);
 
    } catch (err) {
      console.error('获取数据失败：', err);
    }
  };

  useEffect(() => {
    fetchData(); // 初始加载
    const interval = setInterval(fetchData, 5000); // 每5秒刷新一次
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        {/* <thead>
          <tr style={{ background: '#ddd', color:'#fff' }}>
            <th>位置</th>
            <th>编号</th>
            <th>车手</th>
            <th>车队</th>
            <th>圈速</th>
            <th>轮胎</th>
          </tr>
        </thead> */}
        <tbody>
          {drivers.map((driver, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid #ccc', color:'#fff' }}>
                <td style={{ backgroundColor: `#${driver.team_colour}` || '#444' ,width:30}}>{driver.position}</td>
                {/* <td>{driver.number}</td> */}
                <td style={{ backgroundColor: `#${driver.team_colour}` || '#444',width:40 }}>{driver.name}</td>
           
              <td> + {driver.interval}</td>
              <td>{driver.lapTime}</td>
              <td>{driver.fastestLap}</td>
              <td>{driver.tyre}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DriverRank;