import React, { useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { myContext } from "../context/Context"
import ButtonAddAudit from './ButtonAddAudit';
import Cards from './Cards';
import { DELETE_AUDIT, ADD_AUDIT_BY_LOCALSTORAGE, SET_VALUE_MENU_STATUS } from '../reducer/ActionsType'
import Filter from './Filter';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { toast } from "react-toastify"
import { useNavigate } from 'react-router-dom';
import Chart from './Chart';
import "./Home.css"
import { Container } from 'react-bootstrap';

const Home = () => {
  const { state, dispatch, getLocalStorage } = useContext(myContext)
  const [data, setData] = useState([])
  const [dataFilter, setDataFilter] = useState("")
  const [auditeur, setauditeur] = useState("")
  const [demandeur, setDemandeur] = useState("")
  const [auditCount, setAuditCount] = useState([])
  const navigate = useNavigate()

  const dispatch_ADD_AUDIT = useCallback(() => {
    dispatch({ type: ADD_AUDIT_BY_LOCALSTORAGE, payload: getLocalStorage() })
  }, [dispatch, getLocalStorage])

  const dispatch_SET_VALUE_MENU_STATUS = useCallback(() => {
    dispatch({ type: SET_VALUE_MENU_STATUS, payload: dataFilter })
  }, [dataFilter, dispatch])


  useEffect(() => {
    let stateLocal = getLocalStorage()
    if (stateLocal.length === 0) {
      navigate("/")
    } else {
      dispatch_ADD_AUDIT()
    }
    // eslint-disable-next-line
  }, [])

  const countStatusAudit = useCallback(() => {
    let arrayStatusCount = [0, 0, 0]

    for (let item of state[0].datas) {
      if (item.status === 1) {
        arrayStatusCount[0] += 1
      }
      if (item.status === 2) {
        arrayStatusCount[1] += 1
      }
      if (item.status === 3) {
        arrayStatusCount[2] += 1
      }
    }

    setAuditCount(auditCount => arrayStatusCount)
  }, [state,])

  useEffect(() => {
    setData(state[0].datas)
    setDataFilter(dataFilter => state[0].valueStatusMenu)
    setauditeur(auditeur => state[0].auditeur)
    setDemandeur(demandeur => state[0].demandeur)
    countStatusAudit()
  }, [state, data, countStatusAudit])

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
    <Container className="App">
      <div className='main-header'>
        <div>
          <p><span>Auditeur : </span><span>{auditeur}</span></p>
          <p><span>Demandé par : </span><span>{demandeur}</span></p>
          <div className='main-Btn-add-audit'><ButtonAddAudit /></div>
        </div>
        <div style={{ width: '355px' }}>
          <Chart auditCount={auditCount} />
        </div>
      </div>
      <div className='main-items'>
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
      </div>

      <ToastContainer />
    </Container>

  );
}

export default Home;

