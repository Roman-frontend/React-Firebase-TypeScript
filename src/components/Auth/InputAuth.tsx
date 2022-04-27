import React, { ChangeEvent, ReactElement } from 'react';
import { Field, ErrorMessage, FieldProps } from 'formik';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';

interface IProps {
  name: string;
  state: string;
  setState: React.Dispatch<React.SetStateAction<string>>;
}

interface FormValues {
  state: string;
}

const InfoInput = (props: IProps): ReactElement => {
  const { name, state, setState } = props;

  const handlerInput = (event: ChangeEvent<HTMLInputElement>) => {
    setState(event.target.value);
  };

  return (
    <>
      <Field name={name}>
        {({ meta }: FieldProps<FormValues>) => {
          return (
            <>
              <FormControl
                id={name}
                sx={{ m: 1, width: '70%' }}
                variant="outlined"
              >
                <TextField
                  style={{ border: meta.error && 'solid 1px red' }}
                  id={`outlined-basic-${name}}`}
                  label={name}
                  variant="outlined"
                  value={state}
                  onChange={handlerInput}
                />
              </FormControl>
            </>
          );
        }}
      </Field>
      <ErrorMessage
        name={name}
        render={(msg) => <div className="auth-form__error">{msg}</div>}
      />
    </>
  );
};

export default InfoInput;
