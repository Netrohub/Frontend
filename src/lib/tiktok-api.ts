/**
 * TikTok OAuth and Verification API
 */

import { api } from './api';

export interface TikTokProfile {
  open_id: string;
  union_id?: string;
  avatar_url: string;
  display_name: string;
  bio_description?: string;
  username?: string;
  is_verified?: boolean;
}

export const tiktokApi = {
  /**
   * Get TikTok authorization URL
   * Redirects user to TikTok to authorize the app
   */
  authorize: () => 
    api.get<{ authorization_url: string; state: string }>('/tiktok/authorize'),

  /**
   * Get currently connected TikTok profile
   */
  getProfile: () =>
    api.get<{ connected: boolean; profile?: TikTokProfile }>('/tiktok/profile'),

  /**
   * Verify that verification code exists in TikTok bio
   */
  verifyBio: (verificationCode: string) =>
    api.post<{ 
      verified: boolean; 
      message: string; 
      profile?: TikTokProfile;
      error_code?: string;
    }>('/tiktok/verify-bio', { verification_code: verificationCode }),

  /**
   * Disconnect TikTok account
   */
  disconnect: () =>
    api.post<{ message: string }>('/tiktok/disconnect'),
};

