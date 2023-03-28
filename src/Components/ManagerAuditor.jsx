import React, { useEffect, useContext, useState } from "react";
import { myContext } from "../context/Context"
import Table from 'react-bootstrap/Table';
import { MANAGER_AUDITOR } from "../reducer/ActionsType";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

const ManagerAuditor = () => {
    const { state, dispatch, getLocalStorage } = useContext(myContext)
    const [auditeurs, setAuditeurs] = useState([])
    const [show, setShow] = useState(false);
    const [auditorName, setAuditorName] = useState("")

    const handleClose = () => {
        setShow(false);
    }
    const handleShow = () => setShow(true);

    const validationClick = () => {
        AddAuditorName()
        setShow(false)
    }

    const handleChangeAuditorName = (event) => {
        setAuditorName(auditorName => event.target.value)
    }

    useEffect(() => {
        setAuditeurs(auditeurs => state[0].auditeur)
        
        if (state[0].auditeur.length === 0) {
            if (getLocalStorage().length !== 0) {
                setAuditeurs(getLocalStorage()[0].auditeur)
            }
        }
    }, [state, getLocalStorage])


    const deleteAuditor = (event) => {
        let v_auditors = auditeurs.filter(item => item !== event.target.id)
        setAuditeurs(auditeurs => v_auditors)
        dispatch({ type: MANAGER_AUDITOR, payload: { action: "delete", array: v_auditors } })
    }

    const AddAuditorName = () => {
        let arrayName = [...auditeurs]
        arrayName.push(auditorName)
        dispatch({ type: MANAGER_AUDITOR, payload: { action: "add", array: arrayName } })
    }


    return (
        <div>
            <h2>Auditeurs</h2>
            <Button variant="primary" onClick={handleShow}>
                Ajouter
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Ajouter un auditeur</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Prénom</Form.Label>
                            <Form.Control type="text" onChange={handleChangeAuditorName}/>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Fermer
                    </Button>
                    <Button variant="primary" onClick={validationClick}>
                        Ajouter
                    </Button>
                </Modal.Footer>
            </Modal>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Prénom</th>
                        <th>Editer</th>
                        <th>Supprimer</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        auditeurs.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item}</td>
                                <td><button >*</button></td>
                                <td><button id={item} onClick={deleteAuditor}>-</button></td>
                            </tr>
                        ))
                    }
                </tbody>
            </Table>
        </div>
    )
}


export default ManagerAuditor