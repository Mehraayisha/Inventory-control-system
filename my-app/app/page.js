// Server component simple redirect to /login
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/login');
  // Returning null is safe since redirect() throws an internal redirect
  return null;
}