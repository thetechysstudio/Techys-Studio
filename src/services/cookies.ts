// cookieService.ts
import axios from 'axios';

export async function fetchCookies(): Promise<any> {
  try {
    const response = await axios.get(
      'https://api.shop.drmcetit.com/api/cookies/',
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, // keep this if cookies/session are used
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching cookies:', error);
    throw error;
  }
}
