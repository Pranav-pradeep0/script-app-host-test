import { createContext } from 'react';
import PropTypes from 'prop-types';

import useSocketRegistration from '@/utils/hooks/useSocketRegistration';

export const ScriptSocketContext = createContext({
  socket: null,
});

const ScriptSocketProvider = ({ children }) => {
  const [socket] = useSocketRegistration();
  return (
    <ScriptSocketContext.Provider value={{ socket }}>
      {children}
    </ScriptSocketContext.Provider>
  );
};

ScriptSocketProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ScriptSocketProvider;
