const Icon = (
  {
    icon,
    className,
    color = "currentColor"
  }: {
    icon: string;
    className?: string;
    color?: string
  }) => {
  return (
    <i
      className={`${icon} ${className}`}
      style={{ color }}
    />
  );
};

export default Icon;
