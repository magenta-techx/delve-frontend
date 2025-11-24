import { DropdownMenu } from '@/components/ui/Dropdown';
import React from 'react';
interface MobileMenuProps {
  userIsloggedIn: boolean;
}
const MobileMenu = ({}: MobileMenuProps) => {
  return <DropdownMenu></DropdownMenu>;
};

export default MobileMenu;
