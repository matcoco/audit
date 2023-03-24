import React, { useEffect, useState, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { EDIT_AUDIT } from '../reducer/ActionsType';
import { myContext } from "../context/Context"
import 'react-toastify/dist/ReactToastify.min.css';
import { toast } from "react-toastify"
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const EditCard = ({ showEditCard, handleClose, data }) => {
    const [gbook, setGbook] = useState("")
    const inputRef = React.createRef();
    const { state, dispatch } = useContext(myContext)
    const [datas, setDatas] = useState({
        "auditeur": "",
        "demandeur": ""
    })
    const [auditeur, setAuditeur] = useState([])
    const [demandeur, setDemandeur] = useState([])
    const [checkboxAudit, setCheckBoxAudit] = useState([])
    const [styleAudit, setStyleAudit] = useState("")

    useEffect(() => {
        console.log(data)
        setCheckBoxAudit(state[0].checkboxAudit)
        setAuditeur(state[0].auditeur)
        setDemandeur(state[0].demandeur)
        // eslint-disable-next-line
    }, [])

    useEffect(() => {

        let v_data = {
            "auditeur": data.auditeur,
            "demandeur": data.demandeur
        }
        console.log(data)
        setGbook(gbook => data.gbook)
        setDatas(datas => v_data)
        setStyleAudit(styleAudit => data.category)
    }, [data])

    const onChange = (event) => {
        setGbook(event.target.value)
    }


    const verifyUniqueGbook = () => {
        let arrayGbook = []
        for (let item of state[0].datas) {
            if (gbook !== item.gbook) arrayGbook.push(item.gbook)
        }

        if (!arrayGbook.includes(gbook)) return true
        else return false
    }

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
                let newState = { ...data }
                let v_data = {
                    gbook,
                    category: data.category,
                    startAudit: data.startAudit,
                    progress: data.progress,
                    status: data.status,
                    dateDebutAudit: data.dateDebutAudit,
                    dateFinAudit: data.dateFinAudit,
                    demandeur: datas.demandeur,
                    auditeur: datas.auditeur
                }
                newState.gbook = gbook

                handleClose()
                dispatch({ type: EDIT_AUDIT, payload: { newState, lastGbook: data.gbook } })
            } else {
                toast.error("produit déjà présent dans la liste", { closeOnClick: true, autoClose: 2000, })
            }
        } else {
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
                    <div>
                        <Row>
                            <Col>
                                <Form.Label>Auditeur</Form.Label>
                            </Col>
                            <Col>
                                <Form.Select aria-label="filtre" className='main-select-filter' onChange={onChangeDatas} name="auditeur" value={datas.auditeur}>
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
                                <Form.Select aria-label="filtre" className='main-select-filter' onChange={onChangeDatas} name="demandeur" value={datas.demandeur}>
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
                            <Form.Control ref={inputRef} type="number" onChange={onChange} value={gbook} />
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
                                        checked={item.id === styleAudit}
                            
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
    );
}

export default EditCard