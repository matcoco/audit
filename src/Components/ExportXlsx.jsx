import React, { useState } from "react";
import Button from 'react-bootstrap/Button';

const ExportXlsx = () => {
    const [dataJSON, setDataJSON] = useState({})
    
    return (
        <div><Button variant="outline-primary">EXPORTER</Button></div>
    )
}

export default ExportXlsx