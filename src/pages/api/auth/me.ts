import { NextApiRequest, NextApiResponse } from 'next';
import axios from '@/services/api/request';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const response = await axios.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return res.status(200).json({ user: response.data });
  } catch (error: any) {
    console.error('Error in /api/auth/me:', error.response?.data || error);
    return res.status(401).json({ 
      message: error.response?.data?.message || 'Authentication failed'
    });
  }
}
