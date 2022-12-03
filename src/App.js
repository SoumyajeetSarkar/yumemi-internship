import { useEffect, useState } from "react";
import "./App.css";
import MainPage from "./components/main";
//The MainPage component has the list of all prefectures and api calls, the graph component is called inside the mainpage component.
function App() {
  return (
    <div className="App">
      <MainPage/>
    </div>
  );
}

export default App;
