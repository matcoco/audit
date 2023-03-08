import React from 'react';
import Form from 'react-bootstrap/Form';
import './Filter.css';


const Filter = ({filter, dataFilter}) => {
  return (
    <Form.Select aria-label="filtre" className='main-select-filter' onChange={filter} value={dataFilter}>
      <option value={""}>Tous</option>
      <option value={"1"}>Audit en cours</option>
      <option value={"2"}>Audit terminé conforme</option>
      <option value={"3"}>Audit terminé non conforme</option>
    </Form.Select>
  );
}

export default Filter;