import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';

interface DatePickerAtomProps {
  label: string;
  value: Dayjs | null;
  onChange: (value: Dayjs | null) => void;
}

export default function DatePickerAtom({ label, value, onChange }: DatePickerAtomProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        value={value}
        onChange={onChange}
        slotProps={{
          textField: {
            fullWidth: true,
            size: "small",
            margin: "normal",
          },
        }}
      />
    </LocalizationProvider>
  );
}
