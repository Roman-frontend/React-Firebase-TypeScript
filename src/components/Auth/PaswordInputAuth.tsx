import React, { useState, ChangeEvent, ReactElement } from 'react';
import { Field, ErrorMessage, FieldProps } from 'formik';
import FormControl from '@mui/material/FormControl';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';

interface IProps {
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
}

interface FormValues {
  password: string;
}

const PaswordInput = (props: IProps): ReactElement => {
  const { password, setPassword } = props;
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const prevHandleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const prevHandleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Field name="email">
        {({ meta }: FieldProps<FormValues>) => {
          return (
            <>
              <FormControl
                id="password"
                sx={{ m: 1, width: '70%' }}
                variant="outlined"
              >
                <InputLabel>Password</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={showPassword ? 'text' : 'password'}
                  style={{ border: meta.error && 'solid 1px red' }}
                  value={password}
                  onChange={prevHandleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={prevHandleClickShowPassword}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </>
          );
        }}
      </Field>
      <ErrorMessage
        name="password"
        render={(msg) => <div className="auth-form__error">{msg}</div>}
      />
    </>
  );
};

export default PaswordInput;
