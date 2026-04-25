import { OAuth2Client } from 'google-auth-library';
import { appConfig } from '../../config/appConfig';
import { IGoogleAuthVerifier, VerifiedGoogleCredentialPayload } from '../../entities/IGoogleAuthVerifier';

const oauthClient = new OAuth2Client();

export const createGoogleAuthVerifier = (): IGoogleAuthVerifier => ({
  verifyCredential: async (credential: string): Promise<VerifiedGoogleCredentialPayload> => {
    if (!appConfig.GOOGLE_CLIENT_ID) {
      throw new Error('Google sign-in is not configured');
    } 

    const ticket = await oauthClient.verifyIdToken({
      idToken: credential,
      audience: appConfig.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    if (!payload?.sub || !payload.email) {
      throw new Error('Invalid Google credential');
    }

    return {
      email: payload.email,
      emailVerified: Boolean(payload.email_verified),
      googleId: payload.sub,
      name: payload.name,
      picture: payload.picture
    };
  }
});
