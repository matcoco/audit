import React, { useEffect, useState, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { EDIT_AUDIT } from '../reducer/ActionsType';
import { myContext } from "../context/Context"
import 'react-toastify/dist/ReactToastify.min.css';
import { toast } from "react-toastify"

const EditCard = ({ showEditCard, handleClose, data }) => {
    const [gbook, setGbook] = useState("")
    const inputRef = React.createRef();
    const [isEcom, setIsEcom] = useState(false)
    const { state, dispatch } = useContext(myContext)

    useEffect(() => {
        setGbook(gbook => data.gbook)
        setIsEcom(isEcom => data.isEcom)
    }, [data])

    const onChange = (event) => {
        setGbook(event.target.value)
    }

    const onChangeSwitchEcom = (event) => {
        setIsEcom(event.target.checked);

    };

    const verifyUniqueGbook = () => {
        let arrayGbook = []
        for (let item of state[0].datas) {
          arrayGbook.push(item.gbook)
        }
    
        if (!arrayGbook.includes(gbook)) return true
        else return false
      }

    const submit = () => {
        if (gbook !== "") {
            if (verifyUniqueGbook()) {
                let newState = {...data}
                newState.gbook = gbook
                newState.category = isEcom === true ? "audit E-com" : "audit B to B"
                newState.isEcom = isEcom
              setIsEcom(false)
              handleClose()
              dispatch({ type: EDIT_AUDIT, payload: {newState, lastGbook: data.gbook}  })
            } else {
              toast.error("produit déjà présent dans la liste", { closeOnClick: true, autoClose: 2000, })
            }
          }else{
            toast.error("merci de saisir un gbook valide!", { closeOnClick: true, autoClose: 2000, })
          }
      };

    return (
        <div>
            <Modal show={showEditCard} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modification audit</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Form>
                        <Form.Group className="mb-3" controlId="inputGbook">
                            <Form.Label>GBOOK</Form.Label>
                            <Form.Control ref={inputRef} type="number" onChange={onChange} value={gbook}/>
                        </Form.Group>
                        <div>
                            <Form.Check
                                type="switch"
                                id="ecom"
                                label="Audit E-com"
                                onChange={onChangeSwitchEcom}
                                checked={isEcom}
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
    );
}

export default EditCard