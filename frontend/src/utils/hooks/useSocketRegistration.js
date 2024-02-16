import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

import { VITE_BASE_URL } from '@/constants';

const useSocketRegistration = () => {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const s = io(`${VITE_BASE_URL}/`);
    setSocket(s);
    return () => s.disconnect();
  }, []);
  return [socket, setSocket];
};

export default useSocketRegistration;
