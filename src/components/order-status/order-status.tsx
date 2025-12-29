import React, { FC } from 'react';
import { OrderStatusProps } from './type';
import { OrderStatusUI } from '@ui';

const statusText: { [key: string]: string } = {
  pending: 'Готовится',
  done: 'Выполнен',
  created: 'Создан'
};

export const OrderStatus: FC<OrderStatusProps> = ({ status }) => {
  let textStyle = '';

  switch (status) {
    case 'pending':
      textStyle = '#E52B1A'; // красный
      break;
    case 'done':
      textStyle = '#00CCCC'; // бирюзовый
      break;
    case 'created':
      textStyle = '#F2F2F3'; // белый
      break;
    default:
      textStyle = '#F2F2F3'; // белый по умолчанию
  }

  // ИСПРАВЛЕНИЕ: Используем status как ключ, а не textStyle
  return (
    <OrderStatusUI
      textStyle={textStyle}
      text={statusText[status] || 'Неизвестно'}
    />
  );
};
