import React, { useEffect, useState } from "react";

const TrackMap = ({ circuitKey, year }) => {
  const [mapData, setMapData] = useState(null);

  // 获取赛道图数据
  useEffect(() => {
    fetch(`https://api.multiviewer.app/api/v1/circuits/${circuitKey}/${year}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(" mapData loaded:", data);
        setMapData(data);
      })
      .catch((error) => {
        console.error(" Failed to fetch map data:", error);
      });
  }, [circuitKey, year]);

  // 生成 SVG path 的 d 属性字符串
  const getPathD = (x, y) => {
    if (!x || !y || x.length !== y.length || x.length === 0) return "";
    return x.map((val, i) => `${i === 0 ? "M" : "L"} ${val} ${y[i]}`).join(" ");
  };

  // 自动计算 viewBox 范围
  const getBounds = (xArr, yArr) => {
    const minX = Math.min(...xArr);
    const maxX = Math.max(...xArr);
    const minY = Math.min(...yArr);
    const maxY = Math.max(...yArr);
    return {
      minX,
      minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "800px",
        height: "500px",
        margin: "0 auto",
        backgroundColor: "#111", // 背景深色，便于看清线条
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {mapData ? (() => {
        const { x, y } = mapData;
        console.log("📏 X range:", Math.min(...x), "to", Math.max(...x));
        console.log("📏 Y range:", Math.min(...y), "to", Math.max(...y));

        const d = getPathD(x, y);
        console.log("🧩 SVG Path D:", d.slice(0, 100) + "...");

        const { minX, minY, width, height } = getBounds(x, y);

        return (
          <svg
            width="80%"
            height="70%"
            viewBox={`${minX} ${minY} ${width} ${height}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <path
              d={d}
              fill="none"
              stroke="white" 
              strokeWidth="200"
            />
          </svg>
        );
      })() : (
        <p style={{ color: "white" }}>Loading map...</p>
      )}
    </div>
  );
};

export default TrackMap;



// function Track(){
//     const circuitMapImages = {
//         "Bahrain International Circuit": "/images/trackmaps/Bahrain.png",
//         "Albert Park": "/images/trackmaps/AlbertPark.png",
//         "Monza": "/images/trackmaps/Monza.png",
//         "Suzuka": "/trackImages/Suzuka.svg"
//       };
//     return(
//         <img
//         className="track-map"
//         src={`/trackImages/Suzuka.svg`}
//         style={{ width: "100%", maxHeight: 300, objectFit: "contain" }}
//         />
//     )

// }

// export default Track;
