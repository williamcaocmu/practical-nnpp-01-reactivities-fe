import { TextField, TextFieldProps } from "@mui/material";
import {
  type FieldValues,
  useController,
  UseControllerProps,
} from "react-hook-form";

type Props<T extends FieldValues> = {
  label: string;
} & UseControllerProps<T> &
  TextFieldProps;

export default function TextInput<T extends FieldValues>({
  label,
  name,
  control,
  ...props
}: Props<T>) {
  const { field, fieldState } = useController({ name, control });

  return (
    <TextField
      {...props}
      {...field}
      fullWidth
      variant="outlined"
      error={!!fieldState.error}
      helperText={fieldState.error?.message}
    />
  );
}
