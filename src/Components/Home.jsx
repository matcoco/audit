import React, { useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { myContext } from "../context/Context"
import ButtonAddAudit from './ButtonAddAudit';
import Cards from './Cards';
import { DELETE_AUDIT, ADD_AUDIT_BY_LOCALSTORAGE, SET_VALUE_MENU_STATUS } from '../reducer/ActionsType'
import Filter from './Filter';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { toast } from "react-toastify"
import Chart from './Chart';
import "./Home.css"
import { Container } from 'react-bootstrap';


const Home = () => {
  const { state, dispatch, getLocalStorage, navigationPage } = useContext(myContext)
  const [data, setData] = useState([])
  const [dataFilter, setDataFilter] = useState("")
  const [/* auditeur */, setauditeur] = useState("")
  const [/* demandeur */, setDemandeur] = useState("")
  const [auditCount, setAuditCount] = useState([])


  const dispatch_ADD_AUDIT = useCallback(() => {
    dispatch({ type: ADD_AUDIT_BY_LOCALSTORAGE, payload: getLocalStorage() })
  }, [dispatch, getLocalStorage])

  const dispatch_SET_VALUE_MENU_STATUS = useCallback(() => {
    dispatch({ type: SET_VALUE_MENU_STATUS, payload: dataFilter })
  }, [dataFilter, dispatch])



  useEffect(() => {
    let stateLocal = getLocalStorage()
    if (stateLocal.length === 0) {
      navigationPage("/")
    } else {
      dispatch_ADD_AUDIT()
    }
    if(getLocalStorage().length === 0 
    || getLocalStorage()[0]?.auditeur?.length === 0
    || getLocalStorage()[0]?.demandeur?.length === 0
    || getLocalStorage()[0]?.checkboxAudit?.length === 0 
    ){
      toast.info("Merci de configurer l'application avant de l'utiliser ! Cliquer sur l'engrenage pour commencer le paramétrage.", { closeOnClick: true, autoClose: 2000, })
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

  }, [state, data, countStatusAudit, getLocalStorage])

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
              if (filteredList.length === 0) {
                return (
                  <>
                    <img src={'https://img.freepik.com/premium-vector/no-data-concept-illustration_86047-485.jpg?w=360'} alt='no data' />
                  </>

                )
              } else {
                return (
                  <Cards key={index} data={item} deleteCard={deleteCard} />
                )
              }

            })
          }
        </div>
      </div>
      {filteredList.length === 0 ? <div className="pic-no-data"><img src={'https://t4.ftcdn.net/jpg/04/75/01/23/360_F_475012363_aNqXx8CrsoTfJP5KCf1rERd6G50K0hXw.jpg'} alt='no data' /></div> : ""}
      <ToastContainer />
    </Container>

  );
}

export default Home;

