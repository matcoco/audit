import React from 'react';
import Nav from 'react-bootstrap/Nav';
import { IconContext } from 'react-icons'
import { AiFillHome } from "react-icons/ai";
import { NavLink } from 'react-router-dom';

const NavForm = () => {
    return (
        <Nav>
            <Nav.Item>
                <NavLink to="/">
                    <IconContext.Provider value={{ color: "black", size: 40 }}>
                        <AiFillHome />
                    </IconContext.Provider>
                </NavLink>
            </Nav.Item>
        </Nav>
    );
}

export default NavForm;

