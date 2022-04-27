import React from 'react';
import StaticAuth from '../BackgroundAuth';
import SignUpForm from './SignUpForm';

export const SignIn = () => <StaticAuth component={SignUpForm} />;

export default SignIn;
