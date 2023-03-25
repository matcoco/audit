import React, { useReducer } from "react"
import { Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import { myContext } from './context/Context'
import { initialState, reducer } from './reducer/reducer';
import './App.css'
import FormSelectAudit from "./Components/Form";
import SettingsPage from "./Components/SettingsPage";

function App() {
  
  const getLocalStorage = () => {
    if (JSON.parse(localStorage.getItem("datas")) !== null) {
      return JSON.parse(localStorage.getItem("datas"))
    } else {
      return []
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <myContext.Provider value={{ state, dispatch, getLocalStorage }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:gbook" element={<FormSelectAudit />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </myContext.Provider>
  )
}

export default App