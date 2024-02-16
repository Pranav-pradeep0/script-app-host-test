import { Box, useTheme } from '@mui/material';

import SideBarPlugin from '@/plugins/SideBarPlugin';

const ScriptSidebar = () => {
  const { palette } = useTheme();
  return (
    <Box
      width="16rem"
      height="calc(100vh - 4.5rem)"
      bgcolor={palette.primary.dark}
    >
      <SideBarPlugin />
    </Box>
  );
};

export default ScriptSidebar;
