import React, { useEffect, useContext, useState } from "react";
import { myContext } from "../context/Context"
import Table from 'react-bootstrap/Table';
import { MANAGER_CATEGORIES_FORMS, MANAGER_FORMS_SET_CATEGORY_SELECTED } from "../reducer/ActionsType";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import "./SettingsPage.css"
import { AiFillDelete, AiFillEdit, AiOutlineSetting, AiOutlinePlus } from "react-icons/ai";
import { IconContext } from 'react-icons'



const ManagerCategoriesAndForms = () => {
    const { state, dispatch, getLocalStorage, navigationPage } = useContext(myContext)
    const [categories, setCategories] = useState([])
    const [show, setShow] = useState(false);
    const [categorieName, setCategorieName] = useState("")
    const [arrayCB, setArrayCB] = useState([])
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const validationClick = () => {
        AddCategorieName()
        setShow(false)
    }

    const handleChangeCategorieName = (event) => {
        setCategorieName(categorieName => event.target.value)
    }

    const navigation = (item) => {
        dispatch({ type: MANAGER_FORMS_SET_CATEGORY_SELECTED, payload: { storage: getLocalStorage(), item: item } })
        navigationPage("/settings/forms")
    }


    useEffect(() => {
        let arrayCategories = []
        let categoriesCB = state[0].checkboxAudit


        if (getLocalStorage().length !== 0) {
            categoriesCB = getLocalStorage()[0].checkboxAudit
            setArrayCB(arrayCB => categoriesCB)
        }

        for (let item in categoriesCB) {
            arrayCategories.push(categoriesCB[item].label)
        }

        setCategories(categories => arrayCategories)
    }, [state, getLocalStorage])


    const deleteCategorie = (v_item) => {
        let arrayCategories = arrayCB.filter(item => item.label !== v_item)
        dispatch({ type: MANAGER_CATEGORIES_FORMS, payload: { action: "delete_category", array: arrayCategories, value: v_item } })
    }

    const AddCategorieName = () => {
        dispatch({ type: MANAGER_CATEGORIES_FORMS, payload: { action: "add_category", value: categorieName } })
    }


    return (
        <div>
            <h2 className="settings-title">Categories et formulaires</h2>
            <Button className="btn-settingsPage" variant="outline-primary" onClick={handleShow}>
                <IconContext.Provider className="delete" value={{ size: 20 }}>
                    <AiOutlinePlus />
                </IconContext.Provider>
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Ajouter une catégorie</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Nom de la catégorie</Form.Label>
                            <Form.Control type="text" onChange={handleChangeCategorieName} />
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
                        <th><p>Catégories</p></th>
                        <th><p>Editer</p></th>
                        <th><p>Supprimer</p></th>
                        <th><p>parametrer le formulaire</p></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        categories.map((item, index) => (
                            <tr key={index}>
                                <td className="offset_tab"><p>{item}</p></td>
                                <td>
                                    <Button className="btn-settings-op" variant="outline-primary">
                                        <IconContext.Provider value={{ color: "orange", size: 20 }}>
                                            <AiFillEdit />
                                        </IconContext.Provider>
                                    </Button>
                                </td>
                                <td>
                                    <Button className="btn-settings-op" variant="outline-primary" onClick={() => deleteCategorie(item)}>
                                        <IconContext.Provider className="delete" value={{ color: "red", size: 20 }}>
                                            <AiFillDelete />
                                        </IconContext.Provider>
                                    </Button>
                                </td>
                                <td>
                                    <button className="btn-settings-op" id={item} onClick={() => navigation(item)}>
                                        <IconContext.Provider className="delete" value={{ size: 20 }}>
                                            <AiOutlineSetting />
                                        </IconContext.Provider>
                                    </button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </Table>
        </div>
    )
}


export default ManagerCategoriesAndForms