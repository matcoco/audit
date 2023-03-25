import React, { useEffect, useContext, useState } from "react";
import { myContext } from "../context/Context"
import Table from 'react-bootstrap/Table';
import { MANAGER_CATEGORIES_FORMS } from "../reducer/ActionsType";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

const ManagerCategoriesAndForms = () => {
    const { state, dispatch } = useContext(myContext)
    const [forms, setforms] = useState([])
    const [categories, setCategories] = useState([])
    const [show, setShow] = useState(false);
    const [categorieName, setCategorieName] = useState("")

    const handleClose = () => {
        setShow(false);
    }
    const handleShow = () => setShow(true);

    const validationClick = () => {
        AddCategorieName()
        setShow(false)
    }


    const handleChangeCategorieName = (event) => {
        setCategorieName(categorieName => event.target.value)
    }

    useEffect(() => {
        setCategories(categories => state[0].checkboxAudit)
    }, [categories, state])


    const deleteCategorie = (event) => {
        let v_categories = categories.filter(item => item !== event.target.id)
        setCategories(categories => v_categories)
        dispatch({ type: MANAGER_CATEGORIES_FORMS, payload: { action: "delete", array: v_categories } })
    }

    const AddCategorieName = () => {
        let arrayName = [...categories]
        arrayName.push(categories)
        dispatch({ type: MANAGER_CATEGORIES_FORMS, payload: { action: "add", array: arrayName } })
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
                            <Form.Control type="text" onChange={handleChangeCategorieName}/>
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
                        <th>Prénom</th>
                        <th>Editer</th>
                        <th>Supprimer</th>
                    </tr>
                </thead>
                <tbody>
{/*                     {
                        categories.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item}</td>
                                <td><button >*</button></td>
                                <td><button id={item} onClick={deleteCategorie}>-</button></td>
                            </tr>
                        ))
                    } */}
                </tbody>
            </Table>
        </div>
    )
}


export default ManagerCategoriesAndForms