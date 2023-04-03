import React, { useEffect, useState, useContext, useCallback, useMemo } from "react";
import NavForm from "./NavForm";
import { useParams } from 'react-router-dom';
import { myContext } from '../context/Context'
import { ADD_AUDIT_BY_LOCALSTORAGE, SET_AUDIT } from '../reducer/ActionsType';
import ProgressBarComp from "./ProgressBarComp";
import './NavForm.css'
import * as moment from 'moment'
import Form from 'react-bootstrap/Form';
import { Container, FormGroup } from "react-bootstrap";
import "./Form.css"


const FormSelectAudit = () => {
    const { gbook } = useParams();
    const [currentAudit, setCurrentAudit] = useState({})
    const [saveLocale, setSaveLocale] = useState({})
    const [/* progressBar */, setProgressBar] = useState(0)
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
                console.log(item)
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
        console.log(getLocalStorage()[0])
        setCategoryForm(objectsCategory[category])
        saveFormIntoCurrentAudit()
        if (currentAudit.audit !== undefined) {
            if (Object.keys(currentAudit.audit).length) {
                dispatch_SET_AUDIT()
            }
        }

    }, [state, formValues, currentAudit, dispatch_SET_AUDIT, saveFormIntoCurrentAudit, getLocalStorage])



    const formFields = categoryForm && categoryForm?.map((field) => {
        if (field.type === 'select') {
            return (
                <div key={field.name}>
                    <FormGroup className="mb-2 mt-2">
                        <Form.Label><p>{field.label}</p></Form.Label>
                        <Form.Select
                            className="forms"
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
                        </Form.Select>
                    </FormGroup>
                </div>
            );
        } else {
            return (
                <div key={field.name}>
                    <FormGroup className="mb-2 mt-2">
                        <Form.Label><p>{field.label}</p></Form.Label>
                        <Form.Control
                            className="forms"
                            type={field.type}
                            id={field.name}
                            name={field.name}
                            onChange={handleChange}
                            value={formValues[field.name] || ''}
                        />
                    </FormGroup>
                </div>
            );
        }
    });
    const askConfigForm = useMemo(() => {

        return (
            <div>
                <div className="pic-no-data">
                    <img src="https://t4.ftcdn.net/jpg/04/75/01/23/360_F_475012363_aNqXx8CrsoTfJP5KCf1rERd6G50K0hXw.jpg" alt="no-data" />

                </div>
                <div>
                    <h2>Merci de configurer le formulaire {currentAudit.category} depuis les paramètres</h2>
                </div>
            </div>

        )
    }, [currentAudit.category])
    return (
        <>
            <Container>
                <div>
                    <NavForm />
                    <div className="main-header-form">
                        <h2 className="gbook-title">{gbook}</h2>
                        <div className="main-progress-bar">
                            <ProgressBarComp data={currentAudit} />
                        </div>
                    </div>
                </div>

                <form className="main-forms" onSubmit={handleSubmit}>
                    {categoryForm && categoryForm.length !== 0 ? formFields : askConfigForm}
                </form>
            </Container>
        </>
    )
}

export default FormSelectAudit