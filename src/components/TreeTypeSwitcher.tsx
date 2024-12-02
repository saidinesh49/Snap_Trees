import React from 'react';
import styled from 'styled-components';

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
  border: none;
  border-radius: 8px;
  background: ${({ active, disabled }: TabButtonProps) => 
    disabled ? '#adb5bd' : 
    active ? '#4dabf7' : '#e9ecef'};
  color: ${({ active, disabled }: TabButtonProps) => 
    disabled ? '#868e96' : 
    active ? 'white' : '#495057'};
  font-size: 14px;
  font-weight: 600;
  cursor: ${({ disabled }: TabButtonProps) => disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;

  &:hover {
    background: ${({ active, disabled }: TabButtonProps) => 
      disabled ? '#adb5bd' : 
      active ? '#339af0' : '#dee2e6'};
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
  const treeTypes: TreeType[] = ['BST', 'AVL'];  // Temporarily only showing BST and AVL

  return (
    <SwitcherContainer>
      {treeTypes.map(type => (
        <TabButton
          key={type}
          active={currentType === type}
          onClick={() => !disabled && onTypeChange(type)}
          disabled={disabled}
        >
          {type === 'BST' ? 'Binary Search Tree' : 'AVL Tree'}
        </TabButton>
      ))}
    </SwitcherContainer>
  );
}; 