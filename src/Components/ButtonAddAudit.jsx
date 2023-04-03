import React, { useState, useEffect, useContext, useCallback } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { myContext } from "../context/Context"
import { ADD_AUDIT } from '../reducer/ActionsType';
import * as moment from 'moment'
import { toast } from "react-toastify"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./ButtonAddAudit.css"
import { FormGroup } from 'react-bootstrap';



const ButtonAddAudit = () => {
  const [show, setShow] = useState(false)
  const [styleAudit, setStyleAudit] = useState("")
  const inputRef = React.createRef();
  const [gbook, setGbook] = useState("")
  const { state, dispatch, getLocalStorage } = useContext(myContext)
  const [checkboxAudit, setCheckBoxAudit] = useState([])
  const [auditeur, setAuditeur] = useState([])
  const [demandeur, setDemandeur] = useState([])
  const [dateDemand,] = useState(new Date());
  const [date, setDate] = useState("")
  const [datas, setDatas] = useState({
    "auditeur": "",
    "demandeur": ""
  })


  const handleClose = () => setShow(false)

  const handleShow = () => {
    setShow(true)
  }

  const onChange = (event) => {
    setGbook(event.target.value);
  };

  const onChangeDatas = (event) => {
    setDatas({
      ...datas,
      [event.target.name]: event.target.value
    });
  };

  const handleChangeBtnRadio = (event) => {
    setStyleAudit(styleAudit => event.target.id)
  }



  const submit = () => {

    if (gbook !== "" && auditeur !== "" && demandeur !== "" && styleAudit !== "") {
      if (verifyUniqueGbook()) {
        let data = {
          gbook,
          category: styleAudit,
          dateDemand: date,
          startAudit: false,
          progress: 0,
          status: 1,
          dateDebutAudit: moment().format('DD/MM/YYYY'),
          dateFinAudit: "",
          demandeur: datas.demandeur,
          auditeur: datas.auditeur
        }
        handleClose()
        dispatch({ type: ADD_AUDIT, payload: data })
      } else {
        toast.error("produit déjà présent dans la liste", { closeOnClick: true, autoClose: 2000, })
      }
    } else {
      toast.error("merci de saisir tous les champs!", { closeOnClick: true, autoClose: 2000, })
    }
  };


  useEffect(() => {
    setCheckBoxAudit(state[0].checkboxAudit)
    setAuditeur(state[0].auditeur)
    setDemandeur(state[0].demandeur)

    if (state[0].auditeur.length === 0) {
      if (getLocalStorage().length !== 0) {
        setAuditeur(getLocalStorage()[0].auditeur)
        setDemandeur(getLocalStorage()[0].demandeur)
        setCheckBoxAudit(getLocalStorage()[0].checkboxAudit)
      }
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    inputRef.current && inputRef.current.focus()
  }, [inputRef])

  const verifyUniqueGbook = useCallback(() => {
    let arrayGbook = []
    for (let item of state[0].datas) {
      arrayGbook.push(item.gbook)
    }
    if (!arrayGbook.includes(gbook)) return true
    else return false
  }, [gbook, state])

  useEffect(() => {
    verifyUniqueGbook()
  }, [gbook, verifyUniqueGbook])

  const btnAudit = () => {
    let storage = getLocalStorage()[0] ?? []
    let auditeurs = storage?.auditeur?.length ?? 0
    let demandeurs = storage?.demandeur?.length ?? 0
    let category = demandeurs ? Object.keys(storage.forms)?.length : 0

    if (auditeurs !== 0 && demandeurs !== 0 && category !== 0) {
      return (<Button variant="outline-primary" onClick={handleShow}><p className="btn-home-title">AUDIT</p></Button>)
    } else {
      return (<Button variant="outline-primary" disabled><p className="btn-home-title">AUDIT</p></Button>)

    }
  }

  const handleDateDemand = (date) => {
    let newDate = date.toLocaleDateString()
    setDate(date => newDate)
  }

  return (
    <>
      <div>
        {btnAudit()}
      </div>
      <div>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title><p>Nouvel audit</p></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <FormGroup>
                <Form.Label><p>Date de la demande</p></Form.Label>
                <DatePicker className="datePicker" selected={dateDemand} onChange={(date) => handleDateDemand(date)} />
              </FormGroup>
              <FormGroup>
                <Form.Label><p>Auditeur</p></Form.Label>
                <Form.Select aria-label="filtre" className='main-select-filter' onChange={onChangeDatas} name="auditeur">
                  <option value={""} ></option>
                  {
                    auditeur.length > 0 && auditeur.map((item, index) => {
                      return (
                        <option key={index} value={item} >{item}</option>
                      )
                    })
                  }
                </Form.Select>
              </FormGroup>
              <FormGroup>
                <Form.Label><p>Demandeur</p></Form.Label>
                <Form.Select aria-label="filtre" className='main-select-filter' onChange={onChangeDatas} name="demandeur">
                  <option value={""} ></option>
                  {
                    demandeur.length > 0 && demandeur.map((item, index) => {
                      return (
                        <option key={index} value={item} >{item}</option>
                      )
                    })
                  }
                </Form.Select>
              </FormGroup>
            </div>
            <Form>
              <Form.Group className="mb-3" controlId="inputGbook">
                <Form.Label><p>GBOOK</p></Form.Label>
                <Form.Control ref={inputRef} type="number" onChange={onChange} />
              </Form.Group>
              <div>
                {checkboxAudit && checkboxAudit.map((item, index) => {
                  return (
                    <Form.Check key={index}
                      inline
                      label={item.label}
                      name={item.name}
                      type={item.type}
                      id={item.id}
                      onChange={handleChangeBtnRadio}
                    />
                  )
                })
                }
              </div>
            </Form>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              <p>Fermer</p>
            </Button>
            <Button
              variant="primary"
              onClick={submit}>
              <p>Valider</p>
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

    </>
  );
}

export default ButtonAddAudit;