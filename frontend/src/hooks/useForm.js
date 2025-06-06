import { useState } from 'react';

export const useForm = (initialState, validations) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  const handleChange = ({ target: { name, value } }) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' })); // Clear error on change
  };

  const validate = () => {
    const newErrors = {};
    Object.keys(validations).forEach(field => {
      const error = validations[field](formData[field], formData);
      if (error) newErrors[field] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { formData, handleChange, errors, setErrors, validate, setFormData };
};