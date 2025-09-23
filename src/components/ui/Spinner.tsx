import React from 'react';

interface SpinnerProps {
  borderColor?: string;
}
const Spinner = ({
  borderColor = 'border-white',
}: SpinnerProps): JSX.Element => {
  return (
    <div
      className={`h-5 w-5 animate-spin rounded-full border-4 ${borderColor} border-t-transparent`}
    ></div>
  );
};

export default Spinner;
