import React, { useContext, useEffect, useState } from "react"
import { myContext } from "../context/Context"
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { SET_AUDITEUR } from '../reducer/ActionsType'
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.min.css';
import { toast } from "react-toastify"
import { ToastContainer } from 'react-toastify';

const AuditName = () => {
    const [formAudit, setFormAudit] = useState({
        "auditeur": "",
        "demandeur": ""
    })
    const { state, dispatch, getLocalStorage } = useContext(myContext)
    let navigate = useNavigate();
    const arrayAuditeur = ["Mathieu G", "Samir M"]
    const arrayDemandeur = ["Lauris M", "Djamel S", "Pascal C"]

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormAudit({ ...formAudit, [name]: value })
    }

    useEffect(() => {
        let stateLocal = getLocalStorage()
        if(stateLocal.length > 0){
            if(stateLocal[0]?.auditeur !== "" && stateLocal[0]?.demandeur !== ""){
                navigatePage()
            }
        }
        // eslint-disable-next-line
    }, [])

    const navigatePage = () => navigate("/home");

    const submit = () => {
        if (formAudit.auditeur !== "" && formAudit.demandeur !== "") {
            let newState = [...state]
            newState[0]['auditeur'] = formAudit.auditeur
            newState[0]['demandeur'] = formAudit.demandeur

            dispatch({ type: SET_AUDITEUR, payload: newState })
            navigatePage()
        } else {
            toast.error("merci de saisir les champs!", { closeOnClick: true, autoClose: 2000, })
        }

    }

    return (
        <div>
            <Row>
                <Col>
                    <Form.Label>Auditeur</Form.Label>
                </Col>
                <Col>
                    <Form.Select aria-label="filtre" className='main-select-filter' onChange={handleChange} name="auditeur">
                        <option value={""} ></option>
                        {
                           arrayAuditeur.map((item, index) => {
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
                    <Form.Select aria-label="filtre" className='main-select-filter' onChange={handleChange} name="demandeur">
                        <option value={""} ></option>
                        {
                            arrayDemandeur.map((item, index) => {
                                return (
                                    <option key={index} value={item} >{item}</option>
                                )
                            })
                        }
                    </Form.Select>
                </Col>
            </Row>
            <Button variant="outline-primary" onClick={submit}>Valider</Button>
            <ToastContainer />
        </div>
    )
}

export default AuditName