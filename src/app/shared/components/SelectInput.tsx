import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  type SelectProps,
} from "@mui/material";
import {
  type FieldValues,
  useController,
  UseControllerProps,
} from "react-hook-form";

type Props<T extends FieldValues> = {
  items: { text: string; value: string }[];
  label: string;
} & UseControllerProps<T> &
  SelectProps;

export default function SelectInput<T extends FieldValues>({
  label,
  name,
  control,
  ...props
}: Props<T>) {
  const { field, fieldState } = useController({ name, control });

  return (
    <FormControl>
      <InputLabel>{label}</InputLabel>
      <Select label={label} value={field.value} onChange={field.onChange}>
        {props.items.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.text}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{fieldState.error?.message}</FormHelperText>
    </FormControl>
  );
}
