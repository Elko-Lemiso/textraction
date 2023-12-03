import { useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useUser, useSupabaseClient,createPagesServerClient } from "@supabase/auth-helpers-react";
import { useRouter } from 'next/router';

export const getURL = () => {
  let url = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_VERCEL_URL ?? 'http://localhost:3000/';
  url = url.includes('http') ? url : `https://${url}`;
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
  return url;
};

function Authentication() {
  const supabase = useSupabaseClient();
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        router.push('/dashboard');
      }
      // Add error handling if necessary
    });

  }, [user, router, supabase.auth]);

  if (user) {
    return null; // or a loading indicator
  }

  return (
    <Auth
      supabaseClient={supabase}
      redirectTo={`${getURL()}api/auth/callback`}
      magicLink={true}
      providers={[]}
      showLinks={false}
      view="sign_in"
      appearance={{
        theme: ThemeSupa,
        variables: {
          default: {
            colors: {
              brand: '#404040',
              brandAccent: '#52525b',
            },
          },
        },
      }}
      theme="dark"
    />
  );
}

export default Authentication;
