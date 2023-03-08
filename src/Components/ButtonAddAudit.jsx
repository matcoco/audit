import React, { useState, useEffect, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { myContext } from "../context/Context"
import { ADD_AUDIT } from '../reducer/ActionsType';
import * as moment from 'moment'
import { toast } from "react-toastify"




const ButtonAddAudit = () => {
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const [isEcom, setIsEcom] = useState(false)
  const inputRef = React.createRef();
  const [gbook, setGbook] = useState("")
  const { state, dispatch } = useContext(myContext)

  const onChange = (event) => {
    setGbook(event.target.value);
  };

  const onChangeSwitchEcom = (event) => {
    setIsEcom(event.target.checked);

  };

  const submit = () => {
    if (gbook !== "") {
      if (verifyUniqueGbook()) {
        let datas = {
          gbook,
          category: isEcom === true ? "audit E-com" : "audit B to B",
          startAudit: false,
          isEcom: isEcom,
          progress: 0,
          status: 1,
          dateDebutAudit: moment().format('DD/MM/YYYY'),
          dateFinAudit: ""
        }
        setIsEcom(false)
        handleClose()
        dispatch({ type: ADD_AUDIT, payload: datas })
      } else {
        toast.error("produit déjà présent dans la liste", { closeOnClick: true, autoClose: 2000, })
      }
    }else{
      toast.error("merci de saisir un gbook valide!", { closeOnClick: true, autoClose: 2000, })
    }
  };

  useEffect(() => {
    verifyUniqueGbook()
  }, [gbook])

  useEffect(() => {
    inputRef.current && inputRef.current.focus()
  }, [inputRef])

  const verifyUniqueGbook = () => {
    let arrayGbook = []
    for (let item of state[0].datas) {
      arrayGbook.push(item.gbook)
    }

    if (!arrayGbook.includes(gbook)) return true
    else return false
  }

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

            <Form>
              <Form.Group className="mb-3" controlId="inputGbook">
                <Form.Label>GBOOK</Form.Label>
                <Form.Control ref={inputRef} type="number" onChange={onChange} />
              </Form.Group>
              <div>
                <Form.Check
                  type="switch"
                  id="ecom"
                  label="Audit E-com"
                  onChange={onChangeSwitchEcom}
                />

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