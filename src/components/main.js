import React, { useState, useEffect } from "react";
import PopulationGraph from "./population-graph";
import "./styles.css";
function MainPage() {
  const [pref, setPref] = useState([]);
  const [selected, setSelected] = useState([]);
  const [graphData, setGraphData] = useState([]);
  useEffect(() => {
    const getPrefectures = () => {
      fetch("https://opendata.resas-portal.go.jp/api/v1/prefectures", {
        method: "GET",
        headers: {
          "X-API-KEY": process.env.REACT_APP_API_KEY,
          "Content-Type": "application/json;charset=UTF-8",
        },
      })
        .then((res) => res.json())
        .then((data) => setPref(data.result));
      console.log("i fire once");
    };

    getPrefectures();
  }, []);
  console.log(pref, selected, graphData);

  const getPopulationData = async (prefectureCodes) => {
    console.log('fetching population data');
    setGraphData([]);
    await Promise.all(
      prefectureCodes.forEach(async (code) => {
        await fetch(
          `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?cityCode=-&prefCode=${code}`,
          {
            method: "GET",
            headers: {
              "X-API-KEY": process.env.REACT_APP_API_KEY,
              "Content-Type": "application/json;charset=UTF-8",
            },
          }
        )
          .then((res) => res.json())
          .then((data) =>
            setGraphData((prev) => {
              let temp = {
                name: pref[code - 1].prefName,
                data: data.result.data[0].data,
              };
              return [...prev, temp];
            })
          );
      })
    );
    console.log("i fire multiple times", graphData);
  };
  

  //function which changes state of selected prefectures and then calls getPopulationData which fetches data through API.
  const onCheckBoxChange = (code) => {
    if (selected.includes(code)) {
      var arr = selected.filter((value) => value != code);
    } else {
      var arr = [...selected, code];
    }
    setSelected(arr);
    getPopulationData(arr);
    //console.log(selected, "here");
  };

  //JSX function to display prefecture name and the corresponding checkbox
  const CheckItem = ({ name, code }) => (
    <div className="check-item">
      <input
        type="checkbox"
        onChange={() => {
          onCheckBoxChange(code);
        }}
        defaultChecked={selected.includes(code) ? true : false}
      />
      <h3>{name}</h3>
    </div>
  );

  return (
    <div className="check-list-wrapper">
      <h2 className="check-list_header">都道府県の人口数</h2>
      <div className="check-list">
        {pref.map((item) => (
          <CheckItem name={item.prefName} code={item.prefCode} />
        ))}
      </div>
      <PopulationGraph data={graphData} />
    </div>
  );
}

export default MainPage;
