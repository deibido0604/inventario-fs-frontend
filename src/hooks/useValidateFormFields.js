/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from 'react';

const useValidateFormFields = (form, Form) => {
  const [isValid, setIsValid] = useState(false);
  const values = Form.useWatch([], form);

  useEffect(() => {
    if (values) {
      form
        .validateFields({
          validateOnly: true,
        })
        .then(
          () => {
            setIsValid(true);
          },
          () => {
            setIsValid(false);
          }
        );
    }
  }, [values]);

  return {
    isValid,
  };
};

export default useValidateFormFields;
