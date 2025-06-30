import React from 'react'


const Flag = (props) => {
    const countryCodeMap = {
        Australia: "aus",
        Austria: "aut",
        Azerbaijan: "aze",
        Bahrain: "brn",
        Belgium: "bel",
        Brazil: "bra",
        Canada: "can",
        China: "chn",
        Spain: "esp",
        France: "fra",
        "Great Britain": "gbr",
        "United Kingdom": "gbr",
        Germany: "ger",
        Hungary: "hun",
        Italy: "ita",
        Japan: "jpn",
        "Saudi Arabia": "ksa",
        Mexico: "mex",
        Monaco: "mon",
        Netherlands: "ned",
        Portugal: "por",
        Qatar: "qat",
        Singapore: "sgp",
        "United Arab Emirates": "uae",
        "United States": "usa",
    }
    console.log(countryCodeMap[props.countryCode])

  return (
        
        <img
            src={`/country-flags/${countryCodeMap[props.countryCode]}.${"svg"}`}
            alt = "flag"
            style = {{width:70,height:35}}
        />
  )
}

export default Flag
