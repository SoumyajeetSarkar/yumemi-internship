import React, { useState, useEffect } from "react";
import PopulationGraph from "./population-graph";
import "./styles.css";
function MainPage() {
  const [pref, setPref] = useState([]); //state variable which stores the prefecture list which is fetched from ReSAS.
  const [selected, setSelected] = useState([]); //state variable which stores the selected (checked) prefectures, when the user selects a prefecture it updates
  const [graphData, setGraphData] = useState([]); //state variable which stores the dynamic graph data fetched from ReSAS everytime user selects or unselects a prefecture.
  const [error, setError] = useState("");
  useEffect(() => {
    //everytime component runs the list of prefectures is fetched only once and stored in 'pref' variable
    const getPrefectures = () => {
      try {
        fetch("https://opendata.resas-portal.go.jp/api/v1/prefectures", {
          method: "GET",
          headers: {
            "X-API-KEY": process.env.REACT_APP_API_KEY,
            "Content-Type": "application/json;charset=UTF-8",
          },
        })
          .then((res) => res.json())
          .then((data) => setPref(data.result));
      } catch (error) {
        
        setError(error);
      }
      
    };

    getPrefectures();
  }, []);
 

  const getPopulationData = async (code) => {
    try {
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
            //graphData is updated for the current prefecture data
            let temp = {
              name: pref[code - 1].prefName,
              data: data.result.data[0].data,
            };
            return [...prev, temp];
          })
        );
    } catch (error) { //if there is error the user will be notified of the error
      
        setError(error);
    }
  };

  //this function is called when user selects or unselects a prefecture, it updates state variable 'selected' and calls 'getPopulationData'for the selected prefectures
  const onCheckBoxChange = (code) => {
    var arr = [];
    if (selected.includes(code)) {
      //case: if user unselects an already selected prefecture
      setGraphData((prev)=>{
        let temp = prev.filter((data)=>data.name!==pref[code-1].prefName)
        return temp
      })
      arr = selected.filter((value) => value !== code);
    } else {
      //case: if user selects a new prefecture
      getPopulationData(code)
      arr = [...selected, code];
    }
    setSelected(arr);
    //gets data of updated selected list of prefectures and stores into variable 'graphData'
  };

  //JSX function to display prefecture name and the corresponding checkbox
  const CheckItem = ({ name, code }) => (
    <div
      className="check-item"
      onClick={() => {
        onCheckBoxChange(code);
      }}
    >
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
      {" "}
      {/*wrapper of the main container*/}
      <h2 className="check-list_header">都道府県の人口数</h2>
      <div className="check-list">
        {" "}
        {/* displays list of all prefectures */}
        {pref.map((item) => (
          <CheckItem name={item.prefName} code={item.prefCode} />
        ))}
      </div>
      <h4 style={{ color: "red" }}>{error ? error : ""}</h4> {/*if there is error calling api, it will be displayed in red */}
      <PopulationGraph data={graphData} />{" "}
      {/* component which visualizes LineChart based on the GraphData passed to it*/}
    </div>
  );
}

export default MainPage;
