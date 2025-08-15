'use client';
import Link from 'next/link';
import { ReactNode } from 'react';

interface LogoProps {
  link?: string;
  icon: ReactNode;
}

const Logo = ({ link = '/', icon }: LogoProps): JSX.Element => {
  return <Link href={link}>{icon}</Link>;
};

export default Logo;
