import { Box, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { Trash } from '@phosphor-icons/react';
import { formatDistanceToNow } from 'date-fns';
import PropTypes from 'prop-types';

const DocCard = ({ onOpen, data, handleDelete }) => {
  const { palette } = useTheme();
  const parsedDate = new Date(data.updatedAt);
  const formattedDate = formatDistanceToNow(parsedDate, { addSuffix: true });

  return (
    <Stack height="16rem" width="16rem" borderRadius="0.4rem" component="a" style={{ cursor: 'pointer', }}>
      <Box
        width="100%"
        height="70%"
        sx={{ backgroundColor: palette.secondary.main, }}
        onClick={onOpen}
      ></Box>
      <Box
        width="100%"
        height="30%"
        p="0.5rem"
        sx={{
          backgroundColor: palette.primary.light,
          color: palette.primary.contrastText,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography variant="subtitle1"> {data.title}</Typography>
          <Typography variant="body2">last edited {formattedDate}</Typography>
        </Box>
        <IconButton onClick={handleDelete}>
          <Trash size={18} color={palette.secondary.main} />
        </IconButton>
      </Box>
    </Stack>
  );
};
DocCard.propTypes = {
  onOpen: PropTypes.func,
  handleDelete: PropTypes.func,
  data: PropTypes.shape({
    title: PropTypes.string,
    _id: PropTypes.string,
    updatedAt: PropTypes.string,
  }),
};
export default DocCard;
