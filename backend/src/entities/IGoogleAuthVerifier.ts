export interface VerifiedGoogleCredentialPayload {
  email: string;
  emailVerified: boolean;
  googleId: string;
  name?: string;
  picture?: string;
}

export interface IGoogleAuthVerifier {
  verifyCredential(credential: string): Promise<VerifiedGoogleCredentialPayload>;
}
