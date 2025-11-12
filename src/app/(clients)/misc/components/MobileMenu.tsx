import { DropdownMenu } from '@/components/ui/Dropdown';
import React from 'react';
interface MobileMenuProps {
  userIsloggedIn: boolean;
}
const MobileMenu = ({ userIsloggedIn }: MobileMenuProps) => {
  return <DropdownMenu></DropdownMenu>;
};

export default MobileMenu;
