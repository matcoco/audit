import React, { useEffect, useContext, useState } from "react";
import { myContext } from "../context/Context"
import Table from 'react-bootstrap/Table';
import { MANAGER_AUDITOR } from "../reducer/ActionsType";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.min.css';
import { ToastContainer } from 'react-toastify';
import "./SettingsPage.css"
import { AiFillDelete, AiFillEdit, AiOutlinePlus } from "react-icons/ai";
import { IconContext } from 'react-icons'

const ManagerAuditor = () => {
    const { state, dispatch, getLocalStorage } = useContext(myContext)
    const [auditeurs, setAuditeurs] = useState([])
    const [show, setShow] = useState(false);
    const [auditorName, setAuditorName] = useState("")
    const [showEdit, setShowEdit] = useState(false);
    const [auditorNameIndex, setAuditorNameIndex] = useState(0)

    const handleClose = () => setShow(false);
    const handleCloseEdit = () => setShowEdit(false);
    const handleShow = () => setShow(true);

    const handleShowEdit = (index) => {
        setShowEdit(true);
        setAuditorName(auditorName => auditeurs[index])
        setAuditorNameIndex(auditorNameIndex => index)
    }

    const validationClick = () => {
        AddAuditorName()
        setShow(false)
    }

    const handleChangeAuditorName = (event) => setAuditorName(auditorName => event.target.value)

    const submitEditForm = () => {
        dispatch({ type: MANAGER_AUDITOR, payload: { action: "edit", storage: getLocalStorage(), auditeur: auditorName, index: auditorNameIndex } })
        toast.success("Modification validé !.", { closeOnClick: true, autoClose: 2000, })
        handleCloseEdit()
    }
    useEffect(() => {
        setAuditeurs(auditeurs => state[0].auditeur)

        if (state[0].auditeur.length === 0) {
            if (getLocalStorage().length !== 0) {
                setAuditeurs(getLocalStorage()[0].auditeur)
            }
        }
    }, [state, getLocalStorage])


    const deleteAuditor = (v_item) => {
        let v_auditors = auditeurs.filter(item => item !== v_item)
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
            <h2 className="settings-title">Auditeurs</h2>
            <Button className="btn-settingsPage" variant="outline-primary" onClick={handleShow}>
            <IconContext.Provider value={{ size: 20 }}>
                    <AiOutlinePlus />
                </IconContext.Provider>
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title><p>Ajouter un auditeur</p></Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label><p>Prénom</p></Form.Label>
                            <Form.Control type="text" onChange={handleChangeAuditorName} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        <p>Fermer</p>
                    </Button>
                    <Button variant="outline-primary" onClick={validationClick}>
                        <p>Ajouter</p>
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showEdit} onHide={handleCloseEdit}>
                <Modal.Header closeButton>
                    <Modal.Title><p>Modifier un auditeur</p></Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label><p>Prénom</p></Form.Label>
                            <Form.Control type="text" onChange={handleChangeAuditorName} value={auditorName} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEdit}>
                        <p>Fermer</p>
                    </Button>
                    <Button variant="outline-primary" onClick={submitEditForm}>
                        <p>Valider</p>
                    </Button>
                </Modal.Footer>
            </Modal>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th><p>Prénom</p></th>
                        <th><p>Editer</p></th>
                        <th><p>Supprimer</p></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        auditeurs.map((item, index) => (
                            <tr key={index}>
                                <td className="offset_tab"><p>{item}</p></td>
                                <td>
                                    <Button className="btn-settings-op" variant="outline-primary" onClick={() => handleShowEdit(index)}>
                                        <IconContext.Provider value={{ color: "orange", size: 20 }}>
                                            <AiFillEdit />
                                        </IconContext.Provider>
                                    </Button>
                                </td>
                                <td>
                                    <Button className="btn-settings-op" variant="outline-primary" onClick={() => deleteAuditor(item)}>
                                        <IconContext.Provider className="delete" value={{ color: "red", size: 20 }}>
                                            <AiFillDelete />
                                        </IconContext.Provider>
                                    </Button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </Table>
            <ToastContainer />
        </div>
    )
}


export default ManagerAuditor