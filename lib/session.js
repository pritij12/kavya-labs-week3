import { getServerSession } from 'next-auth';
import { authOptions } from './auth';

// Never crash the page if login is not set up yet. Just treat the visitor as signed out.
export async function getSafeSession() {
  try {
    return await getServerSession(authOptions);
  } catch {
    return null;
  }
}
