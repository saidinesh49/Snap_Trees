import React from 'react';
import styled from 'styled-components';
import { colors } from '../styles/colors';
import { BTreeVisualization } from './BTreeVisualization';

const SwitcherContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

interface TabButtonProps {
  active: boolean;
  disabled?: boolean;
}

const TabButton = styled.button<TabButtonProps>`
  padding: 12px 24px;
  border: 2px solid ${ ({ active }: TabButtonProps) => active ? colors.primary : colors.secondary };
  border-radius: 0;
  background: ${({ active, disabled }: TabButtonProps) => 
    disabled ? colors.secondaryMuted : 
    active ? colors.primary : colors.background};
  color: ${({ active, disabled }: TabButtonProps) => 
    disabled ? colors.textMuted : 
    colors.headline};
  font-size: 14px;
  font-weight: 600;
  cursor: ${({ disabled }: TabButtonProps) => disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;
  box-shadow: 4px 4px 0 ${ ({ active }: TabButtonProps) => active ? colors.secondary : colors.headline };

  &:hover {
    background: ${({ active, disabled }: TabButtonProps) => 
      disabled ? colors.secondaryMuted : 
      active ? colors.primaryHover : colors.surfaceLight};
    box-shadow: 2px 2px 0 ${ ({ active }: TabButtonProps) => active ? colors.secondaryHover : colors.headline };
  }

  &:active {
    box-shadow: none;
    transform: translate(4px, 4px);
  }

  @media (max-width: 768px) {
    flex: 1;
    padding: 10px;
    font-size: 13px;
  }
`;

export type TreeType = 'BST' | 'AVL' | 'RedBlack' | 'BTree';

interface Props {
  currentType: TreeType;
  onTypeChange: (type: TreeType) => void;
  disabled?: boolean;
}

export const TreeTypeSwitcher: React.FC<Props> = ({ 
  currentType, 
  onTypeChange,
  disabled = false
}) => {
  const treeTypes: TreeType[] = ['BST', 'AVL', 'RedBlack', 'BTree'];

  return (
    <SwitcherContainer>
      {treeTypes.map(type => (
        <TabButton
          key={type}
          active={currentType === type}
          onClick={() => !disabled && onTypeChange(type)}
          disabled={disabled}
        >
          {type === 'BST' ? 'Binary Search Tree' : 
           type === 'AVL' ? 'AVL Tree' :
           type === 'RedBlack' ? 'Red-Black Tree' : 'B-Tree'}
        </TabButton>
      ))}
    </SwitcherContainer>
  );
}; 