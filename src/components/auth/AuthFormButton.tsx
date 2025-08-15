import type { ReactNode } from 'react';
import { Button, ButtonProps } from '../ui/Button';

interface AuthFormButtonProps {
  text: string;
  icon: ReactNode;
  className?: string;
  variant?: ButtonProps['variant'];
  onClick?: () => void;
}
const AuthFormButton = ({
  text,
  icon,
  className,
  variant = 'ghost',
  onClick,
}: AuthFormButtonProps): JSX.Element => {
  return (
    <Button
      className={`${className}`}
      variant={variant}
      icon={icon}
      onClick={onClick}
    >
      <span>{text}</span>
    </Button>
  );
};

export default AuthFormButton;
