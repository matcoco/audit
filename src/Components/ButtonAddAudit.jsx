import React, { useState, useEffect, useContext, useCallback } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { myContext } from "../context/Context"
import { ADD_AUDIT } from '../reducer/ActionsType';
import * as moment from 'moment'
import { toast } from "react-toastify"
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'



const ButtonAddAudit = () => {
  const [show, setShow] = useState(false)
  const [styleAudit, setStyleAudit] = useState("")
  const inputRef = React.createRef();
  const [gbook, setGbook] = useState({})
  const { state, dispatch, getLocalStorage } = useContext(myContext)
  const [checkboxAudit, setCheckBoxAudit] = useState([])
  const [auditeur, setAuditeur] = useState([])
  const [demandeur, setDemandeur] = useState([])
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
    if (gbook !== "") {
      if (verifyUniqueGbook()) {
        let data = {
          gbook,
          category: styleAudit,
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
      toast.error("merci de saisir un gbook valide!", { closeOnClick: true, autoClose: 2000, })
    }
  };


  useEffect(() => {
    setCheckBoxAudit(state[0].checkboxAudit)
    setAuditeur(state[0].auditeur)
    setDemandeur(state[0].demandeur)

    if (state[0].auditeur.length === 0) {
      if(getLocalStorage().length !== 0) {
        setAuditeur(getLocalStorage()[0].auditeur)
        setDemandeur(getLocalStorage()[0].demandeur)
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


  return (
    <>
      <div>
        <Button variant="outline-primary" onClick={handleShow}>AUDITER</Button>
      </div>
      <div>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Nouvel audit</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <Row>
                <Col>
                  <Form.Label>Auditeur</Form.Label>
                </Col>
                <Col>
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
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Label>Demandeur</Form.Label>
                </Col>
                <Col>
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
                </Col>
              </Row>
            </div>
            <Form>
              <Form.Group className="mb-3" controlId="inputGbook">
                <Form.Label>GBOOK</Form.Label>
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
              Fermer
            </Button>
            <Button
              variant="primary"
              onClick={submit}>
              Valider
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}

export default ButtonAddAudit;