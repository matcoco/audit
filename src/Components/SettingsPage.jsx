import React from "react";
import { Container } from "react-bootstrap";
import ManagerApplicant from "./ManagerApplicant";
import ManagerAuditor from "./ManagerAuditor";
import ManagerCategoriesAndForms from "./ManagerCategoriesAndForms";

const SettingsPage = () => {
    return (
        <Container>
            <ManagerAuditor />
            <ManagerApplicant />
            <ManagerCategoriesAndForms />
        </Container>
    )
}

export default SettingsPage