import React, { useState } from "react";
import ProgressBarComp from "./ProgressBarComp";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './styleCards.css';
import { useNavigate } from "react-router-dom";
import { AiFillDelete, AiOutlineCheck, AiOutlineClose, AiFillEdit, AiOutlineMinus } from "react-icons/ai";
import { IconContext } from 'react-icons'
import EditCard from "./EditCard";
import Button from 'react-bootstrap/Button';


const Cards = ({ data, deleteCard }) => {
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
            color = "blue"
            break;
    }
    const navigatePage = () => navigate(`/${data.gbook}`);
    return (
        <div className={`container-card ${color}`}>



            <Row className="first-card" style={{ width: '17rem' }}>
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
                        </div> :
                            <IconContext.Provider value={{ color: color, size: 30 }}>
                                    <AiOutlineMinus />
                            </IconContext.Provider>}
                    </div>

                </Col>
            </Row>
            <Row className="second-card">
                <Col className="container-audit-btn">
                    <Button variant="outline-primary audit-btn" onClick={() => navigatePage()}>AUDITER</Button>
                </Col>
                <Col className="btn-func">
                    <div className="edit">
                        <IconContext.Provider value={{ color: "orange", size: 20 }}>
                            <AiFillEdit onClick={() => handleShow()} />
                        </IconContext.Provider>
                    </div>
                    <div className="delete">
                        <IconContext.Provider className="delete" value={{ color: "red", size: 20 }}>
                            <AiFillDelete onClick={() => deleteCard(data.gbook)} />
                        </IconContext.Provider>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col className="main-progressbar">
                    <ProgressBarComp data={data} />
                </Col>
            </Row>


            <EditCard data={data} showEditCard={showEditCard} handleClose={handleClose} />
        </div>
    )
}


export default Cards