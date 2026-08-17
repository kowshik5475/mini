export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  block = false,
  as: Component = 'button',
  className = '',
  ...rest
}) {
  const classes = [
    'btn',
    `btn--${variant}`,
    size === 'sm' ? 'btn--sm' : '',
    block ? 'btn--block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Component className={classes} {...rest}>
      {children}
    </Component>
  )
}
