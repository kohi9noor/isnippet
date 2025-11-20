const Button = <T extends React.ButtonHTMLAttributes<HTMLButtonElement>>(
  props: T
) => {
  return (
    <button
      {...props}
      className={
        "w-full px-4 py-3 text-sm font-light border border-muted/20 rounded-lg hover:bg-secondary/30 bg-secondary transition-all duration-300 " +
        props.className
      }
    >
      {props.children}
    </button>
  );
};

export default Button;
