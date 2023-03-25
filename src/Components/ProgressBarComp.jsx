import ProgressBar from 'react-bootstrap/ProgressBar';
import React, { useEffect } from 'react';

const ProgressBarComp = ({ data }) => {

useEffect(() => {
    console.log(data.progress)
}, [data])

    return <ProgressBar className={`progressbar`} now={data.progress} label={`${data.progress}%`} />;
}



export default ProgressBarComp