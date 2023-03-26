import React, { useContext, useEffect, useState } from "react";
import { myContext } from "../context/Context"
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { MANAGER_FORMS, MANAGER_FORMS_ADD } from "../reducer/ActionsType";


const ManagerForms = () => {
    const { state, dispatch, getLocalStorage } = useContext(myContext)
    const [show, setShow] = useState(false);
    const [label, setLabel] = useState("")
    const [name, setName] = useState("")
    const [type, setType] = useState("")
    const [forms, setForms] = useState([])
    const [options, setOptions] = useState([])
    const [formsSelected, setFormsSelected] = useState([])
    const [categorySelected, setCategorySelected] = useState("")
    const [categoriesArray, setCategoriesArray] = useState([])
    // eslint-disable-next-line 
    const [catSelected, setCatSelected] = useState("")
    const TEXT = "text"
    const SELECT = "select"

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleChangeLabel = (event) => setLabel(label => event.target.value)
    const handleChangeName = (event) => setName(name => event.target.value)

    useEffect(() => {

        if (getLocalStorage().length !== 0) {
            let allForms = getLocalStorage()[0].settings.allForms
            let opts = getLocalStorage()[0].settings.select.options
            let categories = getLocalStorage()[0].checkboxAudit
            let forms = getLocalStorage()[0].forms
            let cat_select = getLocalStorage()[0].settings.formCategorySelected
            setCategoriesArray(categoriesArray => categories.map(item => item.label))
            setForms(forms => allForms)
            setOptions(options => opts)
            setCatSelected(catSelected => cat_select)
            setFormsSelected(formsSelected => forms[`${cat_select}`])
            setCategorySelected(categorySelected => cat_select)
        }

    }, [state, getLocalStorage])


    const submit = () => {
        let obj = {}
        obj[`${categorySelected}`] = formsSelected
        dispatch({ type: MANAGER_FORMS_ADD, payload: { forms: obj, category: categorySelected } })
    }

    const handleChangeForm = (event) => {
        let selection = event.target.value
        if (selection === TEXT) setType(type => selection)
        if (selection === SELECT) {
            setType(type => selection)
        }
    }

    const fieldChoice = (item) => {
        setFormsSelected(formsSelected => [...formsSelected, item])
    }

    const addForm = () => {
        let typeText = { name: name, label: label, type: type }
        let typeSelect = { name: name, label: label, type: type, options: options }

        switch (type) {
            case TEXT:
                dispatch({ type: MANAGER_FORMS, payload: typeText })
                break;

            case SELECT:
                dispatch({ type: MANAGER_FORMS, payload: typeSelect })
                break;

            default:
                break;
        }

        handleClose()
    }

    return (
        <div>
            <h2>Gestionnaire de formulaire</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Libellé</th>
                        <th>Nom</th>
                        <th>Type</th>
                        <th>Editer</th>
                        <th>Supprimer</th>
                        <th>Ajouter</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        forms && forms.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.label}</td>
                                <td>{item.name}</td>
                                <td>{item.type}</td>
                                <td><button >*</button></td>
                                <td><button>-</button></td>
                                <td><button onClick={() => fieldChoice(item)}>+</button></td>
                            </tr>
                        ))
                    }
                </tbody>
            </Table>
            <Button variant="primary" onClick={handleShow}>
                Ajouter
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Ajout un formulaire</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="formLabel">
                        <Form.Label>Label</Form.Label>
                        <Form.Control type="text" onChange={handleChangeLabel} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formName">
                        <Form.Label>Nom</Form.Label>
                        <Form.Control type="text" onChange={handleChangeName} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formMenu">
                        <Form.Label>Type</Form.Label>
                        <Form.Select aria-label="Default select example" onChange={handleChangeForm}>
                            <option>Selectionner le type du champs</option>
                            <option value={TEXT}>Texte</option>
                            <option value={SELECT}>Menu déroulant</option>
                        </Form.Select>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Fermer
                    </Button>
                    <Button variant="primary" onClick={addForm}>
                        Ajouter
                    </Button>
                </Modal.Footer>
            </Modal>

            <h2>Ajout des champs pour formulaire sélectionné</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Libellé</th>
                        <th>Nom</th>
                        <th>Type</th>
                        <th>Editer</th>
                        <th>Supprimer</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        formsSelected && formsSelected.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.label}</td>
                                <td>{item.name}</td>
                                <td>{item.type}</td>
                                <td><button >*</button></td>
                                <td><button id={item}>-</button></td>
                            </tr>
                        ))
                    }
                </tbody>
            </Table>
            <Form.Group className="mb-3" controlId="formMenu">
                <Form.Label>Catégories</Form.Label>
                <Form.Select
                    aria-label="Default select example"
                    onChange={(event) => setCategorySelected(categorySelected => event.target.value)}
                    value={catSelected}
                >
                    <option>Selectionner la catégorie</option>
                    {
                        categoriesArray && categoriesArray.map((item, index) => (
                            <option value={item} key={index}>{item}</option>
                        ))
                    }
                </Form.Select>
            </Form.Group>

            <Button variant="primary" onClick={submit}>
                Valider
            </Button>
        </div>
    )
}


export default ManagerForms