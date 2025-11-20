import { cn } from "../../utils";

const Input = <
  T extends React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }
>(
  props: T
) => {
  return (
    <input
      className={cn(
        "w-full placeholder:text-muted focus:outline-none focus:ring-0 focus:border-muted/20 px-4 py-3 text-sm font-light border border-muted/20 rounded-lg ",
        props.error ? "border-red-500" : "",
        props.className
      )}
      {...props}
    />
  );
};

export default Input;
