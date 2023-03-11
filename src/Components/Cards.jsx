import React, { useState } from "react";
import ProgressBarComp from "./ProgressBarComp";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './styleCards.css';
import { useNavigate } from "react-router-dom";
import { AiFillDelete, AiOutlineCheck, AiOutlineClose, AiFillEdit } from "react-icons/ai";
import { IconContext } from 'react-icons'
import Button from 'react-bootstrap/Button';
import EditCard from "./EditCard";


const Cards = ({ data, deleteCard, editCard }) => {
    const [showEditCard, setShowEditCard] = useState(false);

    const handleClose = () => setShowEditCard(false);
    const handleShow = () => setShowEditCard(true);

    let navigate = useNavigate();
    let color = ""

    switch (data.status) {
        case 3:
            color = "red"
            break;
        case 2:
            color = "green"
            break;

        default:
            break;
    }
    const navigatePage = () => navigate(`/${data.gbook}`);
    return (
        <div className={`container-card ${color}`}>
            <Row className="row-card" style={{ width: '25rem' }}>
                <Col>
                    <div><h2>{data.gbook}</h2></div>
                    <div className="d-flex align-items-center">
                        <div className="category">
                            <p>{data.category}</p>
                        </div>
                        {data.status !== 1 ? <div>
                            <IconContext.Provider value={{ color: color, size: 30 }}>
                                {data.status === 2 ?
                                    <AiOutlineCheck /> :
                                    <AiOutlineClose />}
                            </IconContext.Provider>
                        </div> : ""}
                    </div>

                </Col>
                <Col className="main-progressbar">
                    <ProgressBarComp data={data} />
                </Col>
            </Row>
            <Row className="row-card">
                <Col className="container-audit-btn">
                    <Button variant="outline-primary audit-btn" onClick={() => navigatePage()}>AUDITER</Button>
                </Col>
            </Row>

            <Row className="row-card">
                <Col className="edit">
                    <IconContext.Provider value={{ color: "orange", size: 20 }}>
                        <AiFillEdit onClick={() => handleShow()} />
                    </IconContext.Provider>
                </Col>
            </Row>
            <Row className="row-card">
                <Col className="delete">
                    <IconContext.Provider value={{ color: "red", size: 20 }}>
                        <AiFillDelete onClick={() => deleteCard(data.gbook)} />
                    </IconContext.Provider>
                </Col>
            </Row>
            <EditCard data={data} showEditCard={showEditCard} handleClose={handleClose} />
        </div>
    )
}


export default Cards