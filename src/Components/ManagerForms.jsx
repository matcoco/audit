import React, { useContext, useEffect, useState } from "react";
import { myContext } from "../context/Context"
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { MANAGER_FORMS, MANAGER_FORMS_ADD, MANAGER_FORMS_CSV, MANAGER_FORMS_SELECTED_DELETE, MANAGER_FORMS_DELETE } from "../reducer/ActionsType";
import { toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.min.css';
import { ToastContainer } from 'react-toastify';
import Papa from "papaparse"

const ManagerForms = () => {
    const { state, dispatch, getLocalStorage, verificationDoubs } = useContext(myContext)
    const [show, setShow] = useState(false);
    const [label, setLabel] = useState("")
    const [name, setName] = useState("")
    const [type, setType] = useState("")
    const [forms, setForms] = useState([])
    const [options, setOptions] = useState([])
    const [formsSelected, setFormsSelected] = useState([])
    const [categorySelected, setCategorySelected] = useState("")
    const [/* categoriesArray */, setCategoriesArray] = useState([])
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


    const submit = (array) => {
        let obj = {}
        obj[`${categorySelected}`] = array
        console.log(obj)
        dispatch({ type: MANAGER_FORMS_ADD, payload: { forms: obj, category: categorySelected, storage: getLocalStorage() } })
        toast.success("Ajout validé !.", { closeOnClick: true, autoClose: 2000, })
    }

    const handleChangeForm = (event) => {
        let selection = event.target.value
        if (selection === TEXT) setType(type => selection)
        if (selection === SELECT) {
            setType(type => selection)
        }
    }

    const fieldChoice = (item) => {
        if (verificationDoubs(item.name, formsSelected)) {
            /* setFormsSelected(formsSelected => [...formsSelected, item]) */
            submit([...formsSelected, item])
        } else {
            toast.error("Element déjà présent dans la liste !")
        }

    }

    const addForm = () => {
        if (verificationDoubs(name, forms)) {
            let data = {}
            switch (type) {
                case TEXT:
                    data = { name: name, label: label, type: type }
                    dispatch({ type: MANAGER_FORMS, payload: { data: data, storage: getLocalStorage() } })
                    break;

                case SELECT:
                    data = { name: name, label: label, type: type, options: options }
                    dispatch({ type: MANAGER_FORMS, payload: { data: data, storage: getLocalStorage() } })
                    break;

                default:
                    break;
            }

            handleClose()
        } else {
            toast.error("Element déjà présent dans la liste !")
        }

    }

    const deleteElement = (index) => {
        dispatch({ type: MANAGER_FORMS_SELECTED_DELETE, payload: { index: index, category: categorySelected, storage: getLocalStorage(), value: formsSelected[index].name } })
    }

    const deleteElementForm = (index) => {
        dispatch({ type: MANAGER_FORMS_DELETE, payload: { index: index, category: categorySelected, storage: getLocalStorage(), value: forms[index].name } })
    }

    const csvReader = (e) => {
        Papa.parse(e.target.files[0], {
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                buildFormsWithCSVfile(results.data)
            },
        });
    }

    const buildFormsWithCSVfile = (array) => {
        let newArray = []
        let selectType = {}
        for (let item of array) {
            if (item.type === SELECT) {
                selectType = Object.assign(item)
                selectType.options = options
            }
            newArray.push(item)
        }
        dispatch({ type: MANAGER_FORMS_CSV, payload: { data: newArray, storage: getLocalStorage() } })
    }

    return (
        <div>
            <div>
                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Importation formulaire</Form.Label>
                    <Form.Control type="file" onChange={csvReader} />
                </Form.Group>
            </div>
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
                                <td><button onClick={() => deleteElementForm(index)}>-</button></td>
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
                                <td><button id={item} onClick={() => deleteElement(index)}>-</button></td>
                            </tr>
                        ))
                    }
                </tbody>
            </Table>
{/*             <Form.Group className="mb-3" controlId="formMenu">
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
            </Form.Group> */}

{/*             <Button variant="primary" onClick={submit}>
                Valider
            </Button>  */}
            <ToastContainer />
        </div>
    )
}


export default ManagerForms