import React, { ChangeEvent, ReactElement } from 'react';
import { Field, ErrorMessage, FieldProps } from 'formik';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';

interface IProps {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
}

interface FormValues {
  email: string;
}

const EmailInput = (props: IProps): ReactElement => {
  const { email, setEmail } = props;

  const handlerInputEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  return (
    <>
      <Field name="email">
        {({ meta }: FieldProps<FormValues>) => {
          return (
            <>
              <FormControl
                id="email"
                sx={{ m: 1, width: '70%' }}
                variant="outlined"
              >
                <TextField
                  style={{ border: meta.error && 'solid 1px red' }}
                  id="outlined-basic"
                  label="Outlined"
                  variant="outlined"
                  value={email}
                  onChange={handlerInputEmail}
                />
              </FormControl>
            </>
          );
        }}
      </Field>
      <ErrorMessage
        name="email"
        render={(msg) => <div className="auth-form__error">{msg}</div>}
      />
    </>
  );
};

export default EmailInput;
