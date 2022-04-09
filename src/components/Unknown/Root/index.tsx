import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useSigninCheck } from 'reactfire';
import AuthenticatedLayout from '../AuthenticatedLayout';
import GuestLayout from '../GuestLayout';
import HomeScreen from '../HomeScreen';
import NotFoundScreen from '../NotFoundScreen';
import SignInScreen from '../../Auth/SignInScreen';
import Loader from '../Loader/Loader';

const Root: React.FC = () => {
  const { status, data: signInCheckResult } = useSigninCheck();

  if (status === 'loading') {
    return <Loader />;
  }

  if (signInCheckResult.signedIn === true) {
    return (
      <AuthenticatedLayout>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/login" element={<Navigate replace to="/" />} />
          <Route path="/undefined" element={<NotFoundScreen />} />
          <Route path="*" element={<HomeScreen />} />
        </Routes>
      </AuthenticatedLayout>
    );
  }

  return (
    <GuestLayout>
      <Routes>
        <Route path="/login" element={<SignInScreen />} />
        <Route path="/undefined" element={<NotFoundScreen />} />
        <Route path="*" element={<SignInScreen />} />
      </Routes>
    </GuestLayout>
  );
};

export default Root;
