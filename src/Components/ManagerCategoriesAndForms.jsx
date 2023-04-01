import React, { useEffect, useContext, useState } from "react";
import { myContext } from "../context/Context"
import Table from 'react-bootstrap/Table';
import { MANAGER_CATEGORIES_FORMS, MANAGER_FORMS_SET_CATEGORY_SELECTED } from "../reducer/ActionsType";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';


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


    const deleteCategorie = (event) => {
        let arrayCategories = arrayCB.filter(item => item.label !== event.target.id)
        dispatch({ type: MANAGER_CATEGORIES_FORMS, payload: { action: "delete_category", array: arrayCategories, value: event.target.id } })
    }

    const AddCategorieName = () => {
        dispatch({ type: MANAGER_CATEGORIES_FORMS, payload: { action: "add_category", value: categorieName } })
    }


    return (
        <div>
            <h2>Categories et formulaires</h2>
            <Button variant="primary" onClick={handleShow}>
                Ajouter
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
                        <th>#</th>
                        <th>Catégories</th>
                        <th>Editer</th>
                        <th>Supprimer</th>
                        <th>parametrer le formulaire</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        categories.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item}</td>
                                <td><button >*</button></td>
                                <td><button id={item} onClick={deleteCategorie}>-</button></td>
                                <td><button id={item} onClick={() => navigation(item)}>+</button></td>
                            </tr>
                        ))
                    }
                </tbody>
            </Table>
        </div>
    )
}


export default ManagerCategoriesAndForms