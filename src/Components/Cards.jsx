import React, { useState } from "react";
import './styleCards.css';
import { useNavigate } from "react-router-dom";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
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
            color = "rgba(255, 99, 132, 1)"
            break;
        case 2:
            color = "rgba(75, 192, 192, 1)"
            break;

        default:
            color = "rgba(54, 162, 235, 1)"
            break;
    }
    const navigatePage = () => navigate(`/${data.gbook}`);

    const progressNumber = (data) => {
        if(isNaN(data.progress)) return 0
        if(data.progress === null) return 0
        return data.progress
    }

    return (
        <div className={`container-card ${color}`}>
            <div className="main-first-card">
                <div className="first-card">
                    <h2 className="gbook-card">{data.gbook}</h2>
                    <p>{data.category}</p>
                </div>
                <div className="middle-card"><h2>{progressNumber(data)}%</h2></div>
                <div className="end-card">
                    <div>
                        <Button variant="outline-primary audit-btn" onClick={() => navigatePage()}><p>AUDITER</p></Button>
                    </div>
                    <div className="btn-func">
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
                    </div>
                </div>
            </div>
            <div style={{ backgroundColor: color, width: "20px", height: "100%" }}></div>
            <EditCard data={data} showEditCard={showEditCard} handleClose={handleClose} />
        </div>
    )
}


export default Cards