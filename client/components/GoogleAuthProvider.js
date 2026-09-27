'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '319919029645-3jnfmgv2mc93sd7b31t75v7inv3hmm2a.apps.googleusercontent.com';

export default function GoogleAuthProvider({ children }) {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  );
}
