import {
  useController,
  UseControllerProps,
  FieldValues,
} from "react-hook-form";
import {
  DateTimePicker,
  DateTimePickerProps,
} from "@mui/x-date-pickers/DateTimePicker";

type Props<T extends FieldValues> = {
  label: string;
  name: string;
} & UseControllerProps<T> &
  DateTimePickerProps<Date>;

export default function DateTimeInput<T extends FieldValues>({
  label,
  name,
  control,
  ...props
}: Props<T>) {
  const { field, fieldState } = useController({ name, control });

  return (
    <DateTimePicker
      label={label}
      value={field.value ? new Date(field.value) : null}
      onChange={(value) => field.onChange(new Date(value!))}
      sx={{ width: "100%" }}
      slotProps={{
        textField: {
          onBlur: field.onBlur,
          error: !!fieldState.error,
          helperText: fieldState.error?.message,
        },
      }}
      {...props}
    />
  );
}
