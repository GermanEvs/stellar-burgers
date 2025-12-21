import React, { FC } from 'react';
import { Link } from 'react-router-dom'; // ← ДОБАВИТЬ
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => (
  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        {/* Заменяем Fragment на Link */}
        <Link to='/' className={styles.link}>
          <BurgerIcon type={'primary'} />
          <p className='text text_type_main-default ml-2 mr-10'>Конструктор</p>
        </Link>

        {/* Заменяем Fragment на Link */}
        <Link to='/feed' className={styles.link}>
          <ListIcon type={'primary'} />
          <p className='text text_type_main-default ml-2'>Лента заказов</p>
        </Link>
      </div>

      {/* Логотип тоже оборачиваем в Link */}
      <div className={styles.logo}>
        <Link to='/'>
          <Logo className='' />
        </Link>
      </div>

      {/* Профиль оборачиваем в Link */}
      <div className={styles.link_position_last}>
        <Link to='/profile' className={styles.link}>
          <ProfileIcon type={'primary'} />
          <p className='text text_type_main-default ml-2'>
            {userName || 'Личный кабинет'}
          </p>
        </Link>
      </div>
    </nav>
  </header>
);
