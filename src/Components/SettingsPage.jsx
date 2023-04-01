import React from "react";
import ManagerApplicant from "./ManagerApplicant";
import ManagerAuditor from "./ManagerAuditor";
import ManagerCategoriesAndForms from "./ManagerCategoriesAndForms";
import NavGlobal from "./NavGlobal";

const SettingsPage = () => {
    return (
        <div>
            <ManagerAuditor />
            <ManagerApplicant />
            <ManagerCategoriesAndForms />
        </div>
    )
}

export default SettingsPage