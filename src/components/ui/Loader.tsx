import React from 'react';

interface LoaderProps {
  borderColor?: string;
}
const Loader = ({ borderColor = 'border-white' }: LoaderProps): JSX.Element => {
  return (
    <div
      className={`h-5 w-5 animate-spin rounded-full border-4 ${borderColor} border-t-transparent`}
    ></div>
  );
};

export default Loader;
