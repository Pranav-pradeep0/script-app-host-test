import { Stack } from '@mui/material';

import ToolbarPlugin from '@/plugins/ToolbarPlugin';
import { TextArea } from '@script';
import { useState } from 'react';

const TextEditor = () => {
  const [searchText, setSearchText] = useState('');

  return (
    <Stack
      direction="row"
      maxHeight="calc(100vh - 4.5rem)"
      sx={{
        overflowY: 'auto',
        flexGrow: 1,
        justifyContent: 'center',
        py: '1.2rem',
      }}
    >
      <Stack height="max-content" gap="1.27rem">
        {/* <ToolbarPlugin />
        <TextArea /> */}
        <ToolbarPlugin setSearchText={setSearchText} />
        <TextArea searchText={searchText} />
      </Stack>
    </Stack>
  );
};

export default TextEditor;
