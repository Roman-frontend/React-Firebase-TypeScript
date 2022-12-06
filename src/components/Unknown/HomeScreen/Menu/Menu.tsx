import React from 'react';
import { IProps } from './Models/IProps';
import './Menu.css';

function Menu({ header, items, menuActive, setMenuActive }: IProps) {
  return (
    <div
      className={menuActive ? 'menu active' : 'menu'}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Блок з вмістом бургер меню */}
      <div className="menu__content">
        <div className="menu__header">{header}</div>
        <ul>
          {items.map((item) => (
            <li key={item.href}>
              <span className="material-icons">{item.icon}</span>
              <a href={item.href}>{item.value}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Menu;
