import { InputAdornment, OutlinedInput as Input, styled } from '@mui/material';
import { CloudCheck, Pencil } from '@phosphor-icons/react';
import PropTypes from 'prop-types';

const CustomInput = styled(Input)({
  marginLeft: '-5rem',
  userSelect: 'none !important',
  height: 'fit-content',
  fieldSet: {
    display: 'none',
  },
});

const InlineEditable = ({ onBlur, value, onChange }) => {
  // blur on enter or escape
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      e.target.blur();
    }
  };
  return (
    <CustomInput
      startAdornment={
        <InputAdornment position="start">
          <CloudCheck size={16} />
        </InputAdornment>
      }
      endAdornment={
        <InputAdornment position="end">
          <Pencil size={16} weight="thin" />
        </InputAdornment>
      }
      aria-describedby="document-title"
      inputProps={{
        placeholder:'Enter Title',
        'aria-label': 'document-title',
        style: { padding: 0, textAlign: 'center', fontWeight:'600', color:'black' },
      }}
      onKeyDown={handleKeyDown}
      onBlur={onBlur}
      onChange={onChange}
      value={value}
    />
  );
};

InlineEditable.propTypes = {
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default InlineEditable;
