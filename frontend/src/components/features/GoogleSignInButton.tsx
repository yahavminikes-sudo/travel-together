import React, { useEffect, useRef, useState } from 'react';
import { GOOGLE_IDENTITY_SCRIPT_ID, GOOGLE_IDENTITY_SCRIPT_SRC } from '@/constants/auth';

type GoogleButtonStatus =
  | { kind: 'idle' }
  | { kind: 'ready' }
  | { kind: 'error'; message: string };

type GoogleSignInButtonProps = {
  clientId: string;
  disabled?: boolean;
  onCredential: (credential: string) => Promise<void>;
  onError: (message: string) => void;
};

const loadGoogleIdentityScript = async (): Promise<void> => {
  const existingScript = document.getElementById(GOOGLE_IDENTITY_SCRIPT_ID) as HTMLScriptElement | null;

  if (existingScript) {
    if (window.google?.accounts?.id) {
      return;
    }

    await new Promise<void>((resolve, reject) => {
      existingScript.addEventListener('load', () => resolve(), { once: true });
      existingScript.addEventListener('error', () => reject(new Error('Failed to load Google sign-in.')), {
        once: true
      });
    });
    return;
  }

  await new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.id = GOOGLE_IDENTITY_SCRIPT_ID;
    script.src = GOOGLE_IDENTITY_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google sign-in.'));
    document.head.appendChild(script);
  });
};

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  clientId,
  disabled = false,
  onCredential,
  onError
}) => {
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<GoogleButtonStatus>({ kind: 'idle' });

  useEffect(() => {
    let isMounted = true;

    const initializeGoogleButton = async (): Promise<void> => {
      if (!clientId) {
        const message = 'Google sign-in is not configured.';
        if (isMounted) {
          setStatus({ kind: 'error', message });
        }
        onError(message);
        return;
      }

      try {
        await loadGoogleIdentityScript();

        if (!window.google?.accounts?.id || !buttonRef.current) {
          throw new Error('Google sign-in is unavailable right now.');
        }

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: ({ credential }) => {
            void onCredential(credential);
          },
          ux_mode: 'popup'
        });

        buttonRef.current.innerHTML = '';
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: 'outline',
          size: 'large',
          width: 360,
          text: 'continue_with',
          shape: 'rectangular',
          logo_alignment: 'left'
        });

        if (isMounted) {
          setStatus({ kind: 'ready' });
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load Google sign-in.';
        if (isMounted) {
          setStatus({ kind: 'error', message });
        }
        onError(message);
      }
    };

    void initializeGoogleButton();

    return () => {
      isMounted = false;
      if (window.google?.accounts?.id) {
        window.google.accounts.id.cancel();
      }
    };
  }, [clientId, onCredential, onError]);

  const isDisabled = disabled || status.kind === 'error';

  return (
    <div className={isDisabled ? 'opacity-50 pe-none' : undefined}>
      <div ref={buttonRef} />
    </div>
  );
};
