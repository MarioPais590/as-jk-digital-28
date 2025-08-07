
import React from 'react';
import { getCardBrandIcon } from '@/utils/cardBrandDetector';

interface CardBrandIconProps {
  cardNumber: string;
}

export const CardBrandIcon: React.FC<CardBrandIconProps> = ({ cardNumber }) => {
  const iconData = getCardBrandIcon(cardNumber);
  
  const renderElement = (elementData: any): React.ReactElement => {
    if (elementData.tag === 'text') {
      return React.createElement(
        elementData.tag,
        elementData.props,
        elementData.props.children
      );
    }
    
    return React.createElement(elementData.tag, elementData.props);
  };
  
  return (
    <svg
      width={iconData.width}
      height={iconData.height}
      viewBox={iconData.viewBox}
      fill={iconData.fill}
      xmlns={iconData.xmlns}
    >
      {iconData.children.map((child: any, index: number) => (
        <React.Fragment key={index}>
          {renderElement(child)}
        </React.Fragment>
      ))}
    </svg>
  );
};
