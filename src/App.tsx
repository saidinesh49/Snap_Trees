import React, { useState, KeyboardEvent, ChangeEvent } from 'react';
import styled from 'styled-components';
import { TreeVisualization } from './components/TreeVisualization';
import { BinarySearchTree } from './trees/BinarySearchTree';
import { BaseTree } from './trees/BaseTree';
import { TreeType, Operation, AnimationStep } from './types';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-height: 100vh;
  padding: 20px;
  background: #f8f9fa;
  box-sizing: border-box;
  overflow: hidden;
  gap: 20px;
`;

const ControlPanel = styled.div`
  display: flex;
  gap: 20px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  align-items: center;
  z-index: 10;
  flex-shrink: 0;
  position: sticky;
  top: 0;
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  outline: none;

  &:focus {
    border-color: #2196f3;
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1);
  }
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  width: 120px;

  &:focus {
    border-color: #2196f3;
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1);
  }
`;

const Button = styled.button`
  padding: 8px 16px;
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #1976d2;
  }

  &:active {
    background: #1565c0;
  }
`;

const VisualizationArea = styled.div`
  flex: 1;
  min-height: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled(Button)`
  &.clear {
    background: #dc3545;
    &:hover {
      background: #c82333;
    }
  }

  &.undo {
    background: #6c757d;
    &:hover {
      background: #5a6268;
    }
    &:disabled {
      background: #adb5bd;
      cursor: not-allowed;
    }
  }
`;

const SpeedControl = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 20px;
  border-left: 1px solid #dee2e6;
`;

const SpeedSlider = styled.input`
  width: 100px;
`;

const SpeedLabel = styled.span`
  font-size: 14px;
  color: #6c757d;
`;

interface TreeState {
  tree: BaseTree<any>;
  treeData: any;
  animations: AnimationStep[];
}

interface TreeOperation {
  type: Operation;
  value?: number;
}

const App: React.FC = () => {
  const [selectedTree, setSelectedTree] = useState<TreeType>('BST');
  const [operation, setOperation] = useState<Operation>('INSERT');
  const [inputValue, setInputValue] = useState<string>('');
  
  // Keep track of tree states for undo
  const [treeHistory, setTreeHistory] = useState<TreeState[]>([{
    tree: new BinarySearchTree(),
    treeData: new BinarySearchTree().getTreeData(),
    animations: []
  }]);
  const [currentStateIndex, setCurrentStateIndex] = useState<number>(0);
  
  // Keep track of operations for history
  const [operationHistory, setOperationHistory] = useState<TreeOperation[]>([]);

  const [animationSpeed, setAnimationSpeed] = useState<number>(500); // Default speed in ms

  // Get current tree state
  const currentTree = treeHistory[currentStateIndex].tree;
  const currentTreeData = treeHistory[currentStateIndex].treeData;

  const executeOperation = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      alert('Please enter a valid number');
      return;
    }

    let animations: AnimationStep[] = [];
    const newTree = currentTree.clone();

    switch (operation) {
      case 'INSERT':
        animations = newTree.insert(value);
        break;
      case 'DELETE':
        animations = newTree.delete(value);
        break;
      case 'SEARCH':
        animations = newTree.search(value);
        break;
    }

    // Add new state to history with animations
    const newTreeData = newTree.getTreeData();
    const newHistory = treeHistory.slice(0, currentStateIndex + 1);
    newHistory.push({ 
      tree: newTree, 
      treeData: newTreeData,
      animations
    });
    
    setTreeHistory(newHistory);
    setCurrentStateIndex(currentStateIndex + 1);
    setOperationHistory([...operationHistory, { type: operation, value }]);
    setInputValue('');
  };

  const handleClear = () => {
    const newTree = new BinarySearchTree();
    const newTreeData = newTree.getTreeData();
    
    const newHistory = [...treeHistory, { 
      tree: newTree, 
      treeData: newTreeData,
      animations: []
    }];
    
    setTreeHistory(newHistory);
    setCurrentStateIndex(newHistory.length - 1);
    setOperationHistory([...operationHistory, { type: 'CLEAR' }]);
  };

  const handleUndo = () => {
    if (currentStateIndex > 0) {
      setCurrentStateIndex(currentStateIndex - 1);
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      executeOperation();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and empty string
    const value = e.target.value;
    if (value === '' || /^-?\d+$/.test(value)) {
      setInputValue(value);
    }
  };

  const handleSelectTreeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedTree(e.target.value as TreeType);
  };

  const handleOperationChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setOperation(e.target.value as Operation);
  };

  const handleSpeedChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newSpeed = 1000 - parseInt(e.target.value); // Invert the value so higher = faster
    setAnimationSpeed(newSpeed);
  };

  return (
    <AppContainer>
      <ControlPanel>
        <Select
          value={selectedTree}
          onChange={handleSelectTreeChange}
        >
          <option value="BST">Binary Search Tree</option>
          <option value="AVL">AVL Tree</option>
          <option value="RED_BLACK">Red-Black Tree</option>
          <option value="B_TREE">B-Tree</option>
          <option value="B_PLUS_TREE">B+ Tree</option>
        </Select>
        
        <Select
          value={operation}
          onChange={handleOperationChange}
        >
          <option value="INSERT">Insert</option>
          <option value="DELETE">Delete</option>
          <option value="SEARCH">Search</option>
        </Select>
        
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Enter a number"
        />
        
        <ButtonGroup>
          <Button onClick={executeOperation}>
            {operation}
          </Button>
          <ActionButton 
            className="undo"
            onClick={handleUndo}
            disabled={currentStateIndex === 0}
          >
            Undo
          </ActionButton>
          <ActionButton 
            className="clear"
            onClick={handleClear}
          >
            Clear
          </ActionButton>
        </ButtonGroup>
        
        <SpeedControl>
          <SpeedLabel>Animation Speed:</SpeedLabel>
          <SpeedSlider
            type="range"
            min="100"
            max="900"
            value={1000 - animationSpeed}
            onChange={handleSpeedChange}
          />
        </SpeedControl>
      </ControlPanel>
      
      <VisualizationArea>
        <TreeVisualization
          treeData={currentTreeData}
          animations={treeHistory[currentStateIndex].animations}
          animationSpeed={animationSpeed}
        />
      </VisualizationArea>
    </AppContainer>
  );
};

export default App; 