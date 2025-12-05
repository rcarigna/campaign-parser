import {
  Box,
  Typography,
  TextField,
  Radio,
  FormControlLabel,
} from '@mui/material';
import { useState } from 'react';
export const FieldValueOption = ({
  optionKey,
  value,
  source,
  onChange,
  selected,
  groupName,
}: {
  optionKey: string;
  value: string;
  source: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selected: boolean;
  groupName: string;
}) => (
  <Box className='field-option'>
    <FormControlLabel
      value={value}
      control={
        <Radio
          id={optionKey}
          name={groupName}
          value={value}
          onChange={onChange}
          checked={selected}
        />
      }
      label={
        <>
          <Typography>{String(value)}</Typography>
          <Typography className='source'>from {source}</Typography>
        </>
      }
    />
  </Box>
);

export const CustomValueOption = ({
  customValueKey,
  onChange,
  selected,
  groupName,
}: {
  customValueKey: string;
  onChange: (value: unknown) => void;
  selected: boolean;
  groupName: string;
}) => {
  const [customValue, setCustomValue] = useState('');
  const handleRadioChange = () => {
    onChange(customValue);
  };
  const handleCustomValueChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCustomValue(e.target.value);
    if (selected) {
      onChange(e.target.value);
    }
  };
  return (
    <Typography component='label' className='field-option custom-option'>
      <Radio
        name={groupName}
        value={customValueKey}
        checked={selected}
        onChange={handleRadioChange}
      />
      <Box className='field-value custom-value'>
        <Typography variant='body1'>Custom / Combined</Typography>
        <Typography className='source'>
          manually edit or combine values
        </Typography>
      </Box>
      <Box className='custom-input-container'>
        <TextField
          multiline
          className='custom-input'
          value={customValue}
          onChange={handleCustomValueChange}
          placeholder={`Enter custom value for ${groupName}...`}
          rows={3}
        />
        <Box className='custom-hint'>
          💡 Tip: You can combine values from multiple entities above
        </Box>
      </Box>
    </Typography>
  );
};
