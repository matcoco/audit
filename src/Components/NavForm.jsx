import React from 'react';
import Nav from 'react-bootstrap/Nav';
import { IconContext } from 'react-icons'
import { AiFillHome } from "react-icons/ai";


const NavForm = () => {
    return (
        <Nav>
            <Nav.Item>
                <Nav.Link href={"/home"}>
                    <IconContext.Provider value={{ color: "black", size: 40 }}>
                        <AiFillHome  />
                    </IconContext.Provider>
                </Nav.Link>
            </Nav.Item>
        </Nav>
    );
}

export default NavForm;

