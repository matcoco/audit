import React, { useContext, useEffect, useState } from "react";
import { myContext } from "../context/Context"
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { MANAGER_FORMS, MANAGER_FORMS_ADD, MANAGER_FORMS_CSV, MANAGER_FORMS_SELECTED_DELETE, MANAGER_FORMS_DELETE, MANAGER_FORMS_EDIT } from "../reducer/ActionsType";
import { toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.min.css';
import { ToastContainer } from 'react-toastify';
import Papa from "papaparse"
import uniqid from 'uniqid';
import { AiOutlineLeft, AiOutlinePlus, AiFillEdit, AiFillDelete, AiOutlinePlusCircle } from "react-icons/ai";
import { IconContext } from 'react-icons'
import { Container } from "react-bootstrap";
import "./SettingsPage.css"

const ManagerForms = () => {
    const { state, dispatch, getLocalStorage, verificationDoubs, navigationPage } = useContext(myContext)
    const [show, setShow] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [label, setLabel] = useState("")
    const [name, setName] = useState("")
    const [type, setType] = useState("")
    const [id, setId] = useState("")
    const [forms, setForms] = useState([])
    const [options, setOptions] = useState([])
    const [formsSelected, setFormsSelected] = useState([])
    const [categorySelected, setCategorySelected] = useState("")
    const [/* categoriesArray */, setCategoriesArray] = useState([])
    // eslint-disable-next-line 
    const [catSelected, setCatSelected] = useState("")
    const [formIndexEdit, setFormIndexEdit] = useState(0)
    const TEXT = "text"
    const SELECT = "select"

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleShowEditForm = (index) => {
        setShowEditForm(true)
        setName(name => forms[index].name)
        setType(type => forms[index].type)
        setLabel(label => forms[index].label)
        setId(id => forms[index].id)
        setFormIndexEdit(formIndexEdit => index)
    };
    const handleCloseEditForm = () => setShowEditForm(false)
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
        dispatch({ type: MANAGER_FORMS_ADD, payload: { forms: obj, category: categorySelected, storage: getLocalStorage() } })
        toast.success("Ajout validé !.", { closeOnClick: true, autoClose: 2000, })
    }

    const submitEditForm = () => {
        let obj = {
            label,
            name,
            type,
            options,
            id
        }

        dispatch({ type: MANAGER_FORMS_EDIT, payload: { form: obj, formIndex: formIndexEdit, storage: getLocalStorage(), category: categorySelected } })
        toast.success("Modification validé !.", { closeOnClick: true, autoClose: 2000, })
        handleCloseEditForm()
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
                    data = { name: name, label: label, type: type, id: uniqid() }
                    dispatch({ type: MANAGER_FORMS, payload: { data: data, storage: getLocalStorage() } })
                    break;

                case SELECT:
                    data = { name: name, label: label, type: type, id: uniqid(), options: options }
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
        toast.error("Element supprimé!")
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
                selectType.id = uniqid()
                newArray.push(item)
            }
            if (item.type === TEXT) {
                selectType = Object.assign(item)
                selectType.id = uniqid()
                newArray.push(item)
            }
        }
        dispatch({ type: MANAGER_FORMS_CSV, payload: { data: newArray, storage: getLocalStorage() } })
    }

    const navigation = () => {
        navigationPage("/settings")
    }

    return (
        <Container>
            <div className="btn-return-settings">
                <Button variant="outline-primary" onClick={() => navigation()}>
                    <IconContext.Provider value={{ size: 20 }}>
                        <AiOutlineLeft />
                    </IconContext.Provider>
                </Button>
            </div>
            <div>
                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label><p className="settings-title">Importation champs de formulaire</p></Form.Label>
                    <Form.Control type="file" onChange={csvReader} />
                </Form.Group>
            </div>
            <h2 className="settings-title">Gestionnaire de formulaire</h2>
            <div className="table-scrollable">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th><p>Libellé</p></th>
                            <th><p>Nom</p></th>
                            <th><p>Type</p></th>
                            <th><p>Editer</p></th>
                            <th><p>Supprimer</p></th>
                            <th><p>Ajouter</p></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            forms && forms.map((item, index) => (
                                <tr key={index}>
                                    <td><p>{item.label}</p></td>
                                    <td><p>{item.name}</p></td>
                                    <td><p>{item.type === TEXT ? "Saisie texte" : "Menu déroulant"}</p></td>
                                    <td>
                                        <Button className="btn-settings-op" variant="outline-primary" onClick={() => handleShowEditForm(index)}>
                                            <IconContext.Provider value={{ color: "orange", size: 20 }}>
                                                <AiFillEdit />
                                            </IconContext.Provider>
                                        </Button>
                                    </td>
                                    <td>
                                        <Button className="btn-settings-op" variant="outline-primary" onClick={() => deleteElementForm(index)}>
                                            <IconContext.Provider className="delete" value={{ color: "red", size: 20 }}>
                                                <AiFillDelete />
                                            </IconContext.Provider>
                                        </Button>
                                    </td>
                                    <td>
                                        <Button className="btn-settings-op" variant="outline-primary" onClick={() => fieldChoice(item)}>
                                            <IconContext.Provider value={{ size: 20 }}>
                                                <AiOutlinePlusCircle />
                                            </IconContext.Provider>
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            </div>
            <div className="btn-add-field-settings">
                <Button variant="outline-primary" onClick={handleShow}>
                    <IconContext.Provider value={{ size: 20 }}>
                        <AiOutlinePlus />
                    </IconContext.Provider>
                </Button>
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title><p>Ajout un formulaire</p></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="formLabel">
                        <Form.Label><p>Label</p></Form.Label>
                        <Form.Control type="text" onChange={handleChangeLabel} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formName">
                        <Form.Label><p>Nom</p></Form.Label>
                        <Form.Control type="text" onChange={handleChangeName} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formMenu">
                        <Form.Label><p>Type</p></Form.Label>
                        <Form.Select aria-label="Default select example" onChange={handleChangeForm}>
                            <option><p>Selectionner le type du champs</p></option>
                            <option value={TEXT}><p>Texte</p></option>
                            <option value={SELECT}><p>Menu déroulant</p></option>
                        </Form.Select>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        <p>Fermer</p>
                    </Button>
                    <Button variant="outline-primary" onClick={addForm}>
                        <p>Ajouter</p>
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showEditForm} onHide={handleCloseEditForm}>
                <Modal.Header closeButton>
                    <Modal.Title><p>Modifier un formulaire</p></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="formLabel">
                        <Form.Label><p>Label</p></Form.Label>
                        <Form.Control type="text" onChange={handleChangeLabel} value={label} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formName" >
                        <Form.Label><p>Nom</p></Form.Label>
                        <Form.Control type="text" onChange={handleChangeName} value={name} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formMenu">
                        <Form.Label><p>Type</p></Form.Label>
                        <Form.Select aria-label="Default select example" onChange={handleChangeForm} value={type}>
                            <option><p>Selectionner le type du champs</p></option>
                            <option value={TEXT}><p>Texte</p></option>
                            <option value={SELECT}><p>Menu déroulant</p></option>
                        </Form.Select>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEditForm}>
                        <p>Fermer</p>
                    </Button>
                    <Button variant="primary" onClick={submitEditForm}>
                        <p>Valider</p>
                    </Button>
                </Modal.Footer>
            </Modal>
            <h2 className="settings-title">CATEGORIE {catSelected.toUpperCase()}</h2>
            <h2>Ajout des champs pour formulaire sélectionné</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th><p>Libellé</p></th>
                        <th><p>Nom</p></th>
                        <th><p>Type</p></th>
                        <th><p>Supprimer</p></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        formsSelected && formsSelected.map((item, index) => (
                            <tr key={index}>
                                <td><p>{item.label}</p></td>
                                <td><p>{item.name}</p></td>
                                <td><p>{item.type === TEXT ? "Saisie texte" : "Menu déroulant"}</p></td>
                                <td>
                                    <Button className="btn-settings-op" variant="outline-primary" id={item} onClick={() => deleteElement(index)}>
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
        </Container>
    )
}


export default ManagerForms