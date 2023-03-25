import React from "react";
import ManagerApplicant from "./ManagerApplicant";
import ManagerAuditor from "./ManagerAuditor";
import NavGlobal from "./NavGlobal";

const SettingsPage = () => {
    return(
        <div>
            <NavGlobal />
            <ManagerAuditor />
            <ManagerApplicant />
        </div>
    )
}

export default SettingsPage