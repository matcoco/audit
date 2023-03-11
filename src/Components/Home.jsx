import React, { useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { myContext } from "../context/Context"
import ButtonAddAudit from './ButtonAddAudit';
import Cards from './Cards';
import { DELETE_AUDIT, ADD_AUDIT_BY_LOCALSTORAGE, SET_VALUE_MENU_STATUS } from '../reducer/ActionsType'
import Filter from './Filter';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { toast } from "react-toastify"

const Home = () => {
  const { state, dispatch, getLocalStorage } = useContext(myContext)
  const [data, setData] = useState([])
  const [dataFilter, setDataFilter] = useState("")
  const [auditeur, setauditeur] = useState("")
  const [demandeur, setDemandeur] = useState("")

  const dispatch_ADD_AUDIT = useCallback(() => {
    dispatch({ type: ADD_AUDIT_BY_LOCALSTORAGE, payload: getLocalStorage() })
  }, [dispatch, getLocalStorage])

  const dispatch_SET_VALUE_MENU_STATUS = useCallback(() => {
    dispatch({ type: SET_VALUE_MENU_STATUS, payload: dataFilter })
  }, [dataFilter, dispatch])


  useEffect(() => {
    dispatch_ADD_AUDIT()
    // eslint-disable-next-line
  }, [])


  useEffect(() => {
    setData(state[0].datas)
    setDataFilter(dataFilter => state[0].valueStatusMenu)
    setauditeur(auditeur => state[0].auditeur)
    setDemandeur(demandeur => state[0].demandeur)
  }, [state, data])

  useEffect(() => {
    if (dataFilter !== "") {
      dispatch_SET_VALUE_MENU_STATUS()
    }

  }, [dataFilter, dispatch_SET_VALUE_MENU_STATUS])

  const deleteCard = (gbook) => {
    dispatch({ type: DELETE_AUDIT, payload: gbook })
    toast.info("produit supprimé !", { closeOnClick: true, autoClose: 2000, })
  }


  const filter = (event) => {
    let value = +event.target.value
    setDataFilter(value)
  }

  const getFilteredList = () => {
    if (!dataFilter) return data;
    return data.filter((item) => item.status === dataFilter);
  }

  var filteredList = useMemo(getFilteredList, [dataFilter, data]);

  return (
    <div className="App">
      <div className='main-header'>
        <div>
          <p><span>Auditeur : </span><span>{auditeur}</span></p>
          <p><span>Demandé par : </span><span>{demandeur}</span></p>
        </div>
        <div className='main-Btn-add-audit'><ButtonAddAudit /></div>
        <div></div>
      </div>
      <div className='main-filter'>
        <Filter filter={filter} dataFilter={dataFilter} />
      </div>
      <div className='main-cards-audit'>
        {
          filteredList.map((item, index) => {
            return (
              <Cards key={index} data={item} deleteCard={deleteCard} />
            )
          })
        }
      </div>
      <div>
      </div>
      <ToastContainer />
    </div>

  );
}

export default Home;

