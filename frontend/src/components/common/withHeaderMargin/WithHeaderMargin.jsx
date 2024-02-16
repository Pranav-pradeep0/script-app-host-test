import { Box } from '@mui/material';
import PropTypes from 'prop-types';

const WithHeaderMargin = ({ children }) => {
  return <Box marginTop="4.5rem">{children}</Box>;
};

WithHeaderMargin.propTypes = { children: PropTypes.node.isRequired };

export default WithHeaderMargin;
