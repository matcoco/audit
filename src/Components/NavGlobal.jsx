import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { AiOutlineSetting, AiOutlineHome } from "react-icons/ai";
import { IconContext } from 'react-icons'
import { NavLink } from 'react-router-dom';


function NavGlobal() {

    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand><p>MyFuckingAudit</p></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="">
                        <NavLink to="/">
                            <IconContext.Provider className="delete" value={{ color: "red", size: 30 }}>
                                <AiOutlineHome />
                            </IconContext.Provider>
                        </NavLink>
                    </Nav>
                    <NavLink to="/settings">
                        <Nav className="">
                            <IconContext.Provider className="delete" value={{ color: "red", size: 30 }}>
                                <AiOutlineSetting />
                            </IconContext.Provider>
                        </Nav>
                    </NavLink>

                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavGlobal;