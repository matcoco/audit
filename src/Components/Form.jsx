import React, { useEffect, useState, useContext, useCallback, useMemo } from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form';
import NavForm from "./NavForm";
import { useParams } from 'react-router-dom';
import { myContext } from '../context/Context'
import { ADD_AUDIT_BY_LOCALSTORAGE, SET_AUDIT } from '../reducer/ActionsType';
import ProgressBarComp from "./ProgressBarComp";
import './NavForm.css'
import * as moment from 'moment'

const FormSelectAudit = () => {
    const [form_el, setFormEl] = useState({})
    const [isEcom,] = useState(true)
    const { gbook } = useParams();
    const [currentAudit, setCurrentAudit] = useState({})
    const [saveLocale, setSaveLocale] = useState({})
    const [, setProgressBar] = useState(0)
    const { state, dispatch, getLocalStorage } = useContext(myContext);
    const arrayInput = [1]
    const arraySelectNotAuditBtoB = []

    const arrayLabelForm_memo = () => {
        return ["Demande de PC de la cage", "Numéro de série du produit", "Numéro de série conforme à DARRS ?"]
    }

    const arrayLabelForm = useMemo(arrayLabelForm_memo, [])


    const handleChange = (event) => {
        let property = event.target.id
        let value = event.target.value
        setFormEl({ ...form_el, [property]: value })
    }

    const verificationDoneConformeOrNot = useCallback((calcul) => {
        let arrayValueForm = []
        if (calcul >= 100) {
            for (let item in form_el) {
                arrayValueForm.push(form_el[item])
            }
            if (arrayValueForm.includes("NOK")) {
                return 3
            } else {
                return 2
            }
        } else {
            return 1
        }
    }, [form_el])

    const findCurrentAudit_func = useCallback((locale) => {
        for (let item of locale[0].datas) {
            if (item.gbook === gbook) {
                setCurrentAudit(item)
                setSaveLocale(item)
                if (item.hasOwnProperty('audit')) {
                    setFormEl(item.audit)
                } else {
                    setFormEl({})
                }
            }
        }
    }, [gbook])

    const calculProgressBar = useCallback(() => {
        let numLabelForm = arrayLabelForm?.length
        let numFormFill = Object.keys(form_el).length
        let calcul = 0

        let fieldEmpty = 0
        for (let item in form_el) {
            if (form_el[item] === "") {
                fieldEmpty++
            }
        }
        numFormFill -= fieldEmpty
        calcul = Math.round((numFormFill / numLabelForm) * 100)
        return [calcul, verificationDoneConformeOrNot(calcul)]

    }, [arrayLabelForm, form_el, verificationDoneConformeOrNot])

    const saveFormIntoCurrentAudit = useCallback(() => {
        let audit = saveLocale
        audit['audit'] = form_el
        let results = calculProgressBar()
        audit['progress'] = results[0]
        audit['status'] = results[1]
        audit[`dateFinAudit`] = results[0] === 100 ? moment().format('DD/MM/YYYY') : ""
        setProgressBar(results[0])
        setCurrentAudit(currentAudit => currentAudit, audit)
    }, [form_el, saveLocale, calculProgressBar])

    const dispatch_ADD_AUDIT = useCallback(() => {
        dispatch({ type: ADD_AUDIT_BY_LOCALSTORAGE, payload: getLocalStorage() })
    }, [dispatch, getLocalStorage])

    const dispatch_SET_AUDIT = useCallback(() => {
        dispatch({ type: SET_AUDIT, payload: { obj: currentAudit, gbook: gbook } })
    }, [dispatch, gbook, currentAudit])

    useEffect(() => {
        dispatch_ADD_AUDIT()
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        findCurrentAudit_func(state)
    }, [state, findCurrentAudit_func])





    useEffect(() => {
        saveFormIntoCurrentAudit()
        if (currentAudit.audit !== undefined) {
            if (Object.keys(currentAudit.audit).length) {
                dispatch_SET_AUDIT()
            }
        }

    }, [form_el, currentAudit, dispatch_SET_AUDIT, saveFormIntoCurrentAudit])



    return (
        <>
            <div>
                <div>
                    <NavForm />
                    <div>
                        <h2>{gbook}</h2>
                        <div>
                            <ProgressBarComp data={currentAudit} />
                        </div>
                    </div>
                </div>

                {arrayLabelForm.map((item, index) => {
                    if (!arrayInput.includes(index + 1)) {
                        return (
                            <Row key={index}>
                                <Col>
                                    <Form.Label>{item}</Form.Label>
                                </Col>
                                <Col>
                                    <Form.Select
                                        disabled={arraySelectNotAuditBtoB.includes(index + 1) && !isEcom}
                                        aria-label="Default select example"
                                        id={index + 1}
                                        onChange={handleChange}
                                        value={form_el[index + 1]}
                                    >
                                        <option></option>
                                        <option value="OK">OK</option>
                                        <option value="NOK">NOK</option>
                                        <option value="INDISPONIBLE">INDISPONIBLE</option>
                                    </Form.Select>
                                </Col>
                            </Row>
                        )
                    } else {
                        return (
                            <Row key={index}>
                                <Col>
                                    <Form.Label>{item}</Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        id={index + 1}
                                        onChange={handleChange}
                                        value={form_el[index + 1] || ""}
                                    />
                                </Col>
                            </Row>
                        )
                    }
                })}
            </div>
        </>
    )
}

export default FormSelectAudit