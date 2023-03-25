import React, { useEffect, useContext, useState } from "react";
import { myContext } from "../context/Context"
import Table from 'react-bootstrap/Table';
import { MANAGER_APPLICANT } from "../reducer/ActionsType";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

const ManagerApplicant = () => {
    const { state, dispatch, getLocalStorage } = useContext(myContext)
    const [demandeurs, setDemandeurs] = useState([])
    const [show, setShow] = useState(false);
    const [applicantName, setApplicantName] = useState("")

    const handleClose = () => setShow(false);

    const handleShow = () => setShow(true);

    const validationClick = () => {
        AddapplicantName();
        setShow(false)
    }
    const handleChangeapplicantName = (event) => {
        setApplicantName(applicantName => event.target.value)
    }


    useEffect(() => {
        setDemandeurs(demandeurs => state[0].demandeur)

        if (state[0].demandeur.length === 0) {
            if (getLocalStorage().length !== 0) {
                setDemandeurs(getLocalStorage()[0].demandeur)
            }
        }
    }, [state, getLocalStorage])


    const deleteAuditor = (event) => {
        let v_auditors = demandeurs.filter(item => item !== event.target.id)
        setDemandeurs(demandeurs => v_auditors)
        dispatch({ type: MANAGER_APPLICANT, payload: { action: "delete", array: v_auditors } })
    }

    const AddapplicantName = () => {
        let arrayName = [...demandeurs]
        arrayName.push(applicantName)
        dispatch({ type: MANAGER_APPLICANT, payload: { action: "add", array: arrayName } })
    }


    return (
        <div>
            <h2>demandeurs</h2>
            <Button variant="primary" onClick={handleShow}>
                Ajouter
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Ajouter un demandeur</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Prénom</Form.Label>
                            <Form.Control type="text" onChange={handleChangeapplicantName} />
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
                        demandeurs.map((item, index) => (
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


export default ManagerApplicant