import React from 'react'

function InputFloating({type, value, name = "", id, onChange = null, placeholder, label, isRequired = false}) {
  return (
    <div className="form-floating">
      <input value={value} onChange={ onChange } type={type} name={name} className="form-control" id={id} placeholder={placeholder} required={isRequired} />
      <label>{label}</label>
    </div>
  )
}

export default InputFloating;