import React, { useReducer } from "react"
import { Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import { myContext } from './context/Context'
import { initialState, reducer } from './reducer/reducer';
import './App.css'
import FormSelectAudit from "./Components/Form";
import SettingsPage from "./Components/SettingsPage";
import ManagerForms from "./Components/ManagerForms";
import { useNavigate } from "react-router-dom";
import NavGlobal from './Components/NavGlobal';


function App() {
  const navigate = useNavigate()
  const getLocalStorage = () => {
    if (JSON.parse(localStorage.getItem("datas")) !== null) {
      return JSON.parse(localStorage.getItem("datas"))
    } else {
      return []
    }
  }

  const navigationPage = (uri) => {
    navigate(uri)
  }

  const verificationDoubs = (item, array) => {
   const arrayItems = []

    for(let element of array){
      arrayItems.push(element.name)
    }

    if(!arrayItems.includes(item)){
      return true
    }else{
      return false
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <myContext.Provider value={{ state, dispatch, getLocalStorage, navigationPage, verificationDoubs }}>
          <NavGlobal />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:gbook" element={<FormSelectAudit />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/settings/forms" element={<ManagerForms />} />
      </Routes>
    </myContext.Provider>
  )
}

export default App