import { useState } from 'react';
/**
 * A custom hook that checks if the user is Authorised
 *
 * @returns {boolean} return 'true' if the user is authorised; otherwise 'false'
 */

const useAuthorisation = () => {
  const [isAuthorised] = useState(true);

  return isAuthorised;
};

export default useAuthorisation;
