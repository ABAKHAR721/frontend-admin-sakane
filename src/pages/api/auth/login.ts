import { NextApiRequest, NextApiResponse } from 'next';
import axios from '@/services/api/request';
import { setCookie } from '@/utils/cookies';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    const response = await axios.post('/auth/login', {
      email,
      password,
    });

    const { token, user } = response.data;

    // Set the token cookie
    setCookie(res, 'token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return res.status(200).json({ user });
  } catch (error: any) {
    console.error('Error in /api/auth/login:', error.response?.data || error);
    return res.status(401).json({ 
      message: error.response?.data?.message || 'Authentication failed'
    });
  }
}
