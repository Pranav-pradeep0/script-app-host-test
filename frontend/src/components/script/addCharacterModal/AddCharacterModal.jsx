import { useTransliteration } from '@hooks';
import { Button, Modal, Paper, Stack } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import AsyncSelect from 'react-select/async-creatable';
import { useDispatch, useSelector } from 'react-redux';
import { setCharacters } from '@/store/slices/scriptSlice';

// import { debounce as _debounce } from 'lodash';

const AddCharacterModal = ({ socket = {}, id }) => {
  const { characters } = useSelector((state) => state.scripts);
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState([]);
  const transliterate = useTransliteration();
  const dispatch = useDispatch();

  //TODO - Apply debouncing logic to transliteration.
  //FIXME - The results are one step behind the input. Fix this to get debouncing work properly
  //   const debounceTransliterate = _debounce(async (inputString) => {
  //     console.log({ inputString });
  //     try {
  //       const results = await transliterate(inputString);
  //       return Array.isArray(results)
  //         ? results.map((result) => ({ value: result, label: result }))
  //         : [];
  //     } catch (error) {
  //       console.error('Error while fetching transliterated options:', error);
  //       return []; // Return an empty array in case of error
  //     }
  //   }, 300);

  const fetchTransliterated = async (inputString) => {
    const results = await transliterate(inputString);
    return results.map((value) => ({ value, label: value }));
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  const handleSubmit = () => {
    if (!id) {
      throw new Response('id not found', { status: 404 });
    }
    if (socket && socket.connected) {
      socket.emit('save-character', { characters: values, id }, () => {
        dispatch(setCharacters(values));
        setOpen(false);
      });
    } else {
      console.error('socket connection not open');
      setOpen(false);
    }
  };

  const modalContent = (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="manage-characters"
      aria-describedby="add/remove-characters"
      sx={{
        backdropFilter: 'blur(2px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Paper
        sx={{
          width: '50%',
          padding: '3rem 3rem 1rem 3rem',
        }}
      >
        <AsyncSelect
          isMulti
          defaultValue={characters.map((value) => ({
            value,
            label: value,
          }))}
          loadOptions={fetchTransliterated}
          onChange={(values) => setValues(values.map(({ value }) => value))}
        />
        <Stack
          direction="row"
          justifyContent="space-between"
          width="60%"
          marginTop="1rem"
          marginX="auto"
        >
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Save</Button>
        </Stack>
      </Paper>
    </Modal>
  );
  return (
    <>
      <Button
        sx={{ backgroundColor: '#F2F2F2', height: 'fit-content' }}
        onClick={handleOpen}
      >
        Characters
      </Button>
      {createPortal(modalContent, document.body)}
    </>
  );
};

AddCharacterModal.propTypes = {
  socket: PropTypes.object,
  id: PropTypes.string,
  characters: PropTypes.arrayOf(PropTypes.string),
};

export default AddCharacterModal;
