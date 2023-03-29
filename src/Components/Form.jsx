import React, { useEffect, useState, useContext, useCallback } from "react";
import NavForm from "./NavForm";
import { useParams } from 'react-router-dom';
import { myContext } from '../context/Context'
import { ADD_AUDIT_BY_LOCALSTORAGE, SET_AUDIT } from '../reducer/ActionsType';
import ProgressBarComp from "./ProgressBarComp";
import './NavForm.css'
import * as moment from 'moment'
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const FormSelectAudit = () => {
    const { gbook } = useParams();
    const [currentAudit, setCurrentAudit] = useState({})
    const [saveLocale, setSaveLocale] = useState({})
    const [, setProgressBar] = useState(0)
    const { state, dispatch, getLocalStorage } = useContext(myContext);
    const [categoryForm, setCategoryForm] = useState([])
    const [formValues, setFormValues] = useState({});

    // fonction pour mettre à jour le state des valeurs des champs de formulaire
    const handleChange = (event) => {
        setFormValues({
            ...formValues,
            [event.target.name]: event.target.value,
        });
    };

    // fonction pour soumettre le formulaire
    const handleSubmit = (event) => {
        event.preventDefault();
    };


    const verificationDoneConformeOrNot = useCallback((calcul) => {
        let arrayValueForm = []
        if (calcul >= 100) {
            for (let item in formValues) {
                arrayValueForm.push(formValues[item])
            }
            if (arrayValueForm.includes("NOK")) {
                return 3
            } else {
                return 2
            }
        } else {
            return 1
        }
    }, [formValues])

    const findCurrentAudit_func = useCallback((locale) => {
        for (let item of locale[0].datas) {
            if (item.gbook === gbook) {
                setCurrentAudit(item)
                setSaveLocale(item)
                if (item.hasOwnProperty('audit')) {
                    setFormValues(item.audit)
                } else {
                    setFormValues({})
                }
            }
        }
    }, [gbook])

    const calculProgressBar = useCallback(() => {

        let numLabelForm = categoryForm?.length
        let numFormFill = Object.keys(formValues).length
        let calcul = 0

        let fieldEmpty = 0
        for (let item in formValues) {
            if (formValues[item] === "") {
                fieldEmpty++
            }
        }
        numFormFill -= fieldEmpty
        calcul = Math.round((numFormFill / numLabelForm) * 100)
        return [calcul, verificationDoneConformeOrNot(calcul)]
        // eslint-disable-next-line
    }, [formValues, verificationDoneConformeOrNot])

    const saveFormIntoCurrentAudit = useCallback(() => {
        let audit = saveLocale
        audit['audit'] = formValues
        let results = calculProgressBar()
        audit['progress'] = results[0]
        audit['status'] = results[1]
        audit[`dateFinAudit`] = results[0] === 100 ? moment().format('DD/MM/YYYY') : ""
        setProgressBar(results[0])
        setCurrentAudit(currentAudit => currentAudit, audit)
    }, [formValues, saveLocale, calculProgressBar])

    const dispatch_ADD_AUDIT = useCallback(() => {
        dispatch({ type: ADD_AUDIT_BY_LOCALSTORAGE, payload: getLocalStorage() })
    }, [dispatch, getLocalStorage])

    const dispatch_SET_AUDIT = useCallback(() => {
        dispatch({ type: SET_AUDIT, payload: { obj: currentAudit, gbook: gbook } })
    }, [dispatch, gbook, currentAudit])

    useEffect(() => {
        // eslint-disable-next-line
        dispatch_ADD_AUDIT()
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        // eslint-disable-next-line
        findCurrentAudit_func(state)
        // eslint-disable-next-line
    }, [state, findCurrentAudit_func])


    useEffect(() => {
        let objectsCategory = state[0].forms
        let category = currentAudit.category

        setCategoryForm(objectsCategory[category])
        saveFormIntoCurrentAudit()
        if (currentAudit.audit !== undefined) {
            if (Object.keys(currentAudit.audit).length) {
                dispatch_SET_AUDIT()
            }
        }

    }, [state, formValues, currentAudit, dispatch_SET_AUDIT, saveFormIntoCurrentAudit])

    const formFields = categoryForm && categoryForm?.map((field) => {
        if (field.type === 'select') {
            return (
                <div key={field.name}>
                    <Row>
                        <Col>
                            <Form.Label>{field.label}</Form.Label>
                        </Col>
                        <Col>
                            <Form.Select
                                id={field.name}
                                name={field.name}
                                onChange={handleChange}
                                value={formValues[field?.name] || ''}
                            >
                                {field?.options?.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </Form.Select></Col>
                    </Row>
                </div>
            );
        } else {
            return (
                <div key={field.name}>
                    <Row>
                        <Col>
                            <Form.Label>{field.label}</Form.Label>
                        </Col>
                        <Col>
                            <Form.Control
                                type={field.type}
                                id={field.name}
                                name={field.name}
                                onChange={handleChange}
                                value={formValues[field.name] || ''}
                            />
                         
                        </Col>
                    </Row>
                </div>
            );
        }
    });

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

                <form onSubmit={handleSubmit}>
                    {formFields}
                </form>
            </div>
        </>
    )
}

export default FormSelectAudit