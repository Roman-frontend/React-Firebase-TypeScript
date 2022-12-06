import React from 'react';
import { IMenuItems } from '../../Models/IMenuItems';

export interface IProps {
  header: string;
  items: IMenuItems[];
  menuActive: boolean;
  setMenuActive: React.Dispatch<React.SetStateAction<boolean>>;
}
