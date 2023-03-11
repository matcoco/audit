import React, { useReducer } from "react"
import { Routes, Route } from "react-router-dom";
import AuditName from "./Components/AuditName";
import Home from "./Components/Home";
import { myContext } from './context/Context'
import { initialState, reducer } from './reducer/reducer';
import './App.css'
import FormSelectAudit from "./Components/Form";

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
        <Route path="/" exact element={<AuditName />} />
        <Route path="/home" element={<Home />} />
        <Route path="/:gbook" element={<FormSelectAudit />} />
      </Routes>
    </myContext.Provider>
  )
}

export default App