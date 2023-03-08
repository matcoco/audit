import ProgressBar from 'react-bootstrap/ProgressBar';
import React from 'react';

const ProgressBarComp = ({ data }) => {
    return <ProgressBar className={`progressbar`} now={data.progress} label={`${data.progress}%`} />;
}

export default ProgressBarComp