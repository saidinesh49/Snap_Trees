import React, { useState } from 'react';
import styled from 'styled-components';
import { TreeVisualization } from './components/TreeVisualization';
import { BinarySearchTree } from './trees/BinarySearchTree';
import { TreeData, AnimationStep } from './types';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 20px;
  gap: 20px;
  background: #f8f9fa;
`;

const Header = styled.header`
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
  color: #1a1a1a;
`;

const ControlPanel = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ControlGroup = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 14px;
  width: 120px;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #4dabf7;
    box-shadow: 0 0 0 2px rgba(77, 171, 247, 0.2);
  }

  @media (max-width: 768px) {
    flex: 1;
  }
`;

interface ButtonProps {
  variant?: 'primary' | 'danger' | 'secondary' | 'success';
}

const Button = styled.button<ButtonProps>`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  background: ${(props: ButtonProps) => {
    switch (props.variant) {
      case 'danger': return '#fa5252';
      case 'secondary': return '#868e96';
      case 'success': return '#40c057';
      default: return '#4dabf7';
    }
  }};
  color: white;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: ${(props: ButtonProps) => {
      switch (props.variant) {
        case 'danger': return '#e03131';
        case 'secondary': return '#495057';
        case 'success': return '#37b24d';
        default: return '#339af0';
      }
    }};
  }

  &:disabled {
    background: #adb5bd;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    flex: 1;
    justify-content: center;
  }
`;

const Divider = styled.div`
  width: 1px;
  height: 24px;
  background: #dee2e6;
  margin: 0 8px;

  @media (max-width: 768px) {
    width: 100%;
    height: 1px;
    margin: 8px 0;
  }
`;

const VisualizationContainer = styled.div`
  flex: 1;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
  position: relative;
`;

interface TreeState {
  tree: BinarySearchTree;
  data: TreeData;
  animations: AnimationStep[];
}

const App: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState<TreeState[]>([{
    tree: new BinarySearchTree(),
    data: new BinarySearchTree().getTreeData(),
    animations: []
  }]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchResult, setSearchResult] = useState<number | null>(null);

  const currentTree = history[currentIndex].tree;
  const currentData = history[currentIndex].data;

  const addToHistory = (newTree: TreeState) => {
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(newTree);
    setHistory(newHistory);
    setCurrentIndex(currentIndex + 1);
  };

  const handleInsert = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) return;

    const newTree = currentTree.clone();
    newTree.insert(value);
    addToHistory({
      tree: newTree,
      data: newTree.getTreeData(),
      animations: []
    });
    setInputValue('');
    setSearchResult(null);
  };

  const handleDelete = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) return;

    const newTree = currentTree.clone();
    newTree.delete(value);
    addToHistory({
      tree: newTree,
      data: newTree.getTreeData(),
      animations: []
    });
    setInputValue('');
    setSearchResult(null);
  };

  const handleSearch = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) return;

    const animations = currentTree.search(value);
    setSearchResult(value);
    setInputValue('');
    
    addToHistory({
      tree: currentTree.clone(),
      data: currentTree.getTreeData(),
      animations
    });
  };

  const handleClear = () => {
    const newTree = new BinarySearchTree();
    const animations = newTree.clear();
    
    addToHistory({
      tree: newTree,
      data: { nodes: [], links: [] },
      animations: [{
        type: 'clear',
        nodes: currentData.nodes,
        message: 'Clearing all nodes from the tree'
      }]
    });
    
    setSearchResult(null);
  };

  const handleUndo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSearchResult(null);
    }
  };

  const handleRedo = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSearchResult(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^-?\d+$/.test(value)) {
      setInputValue(value);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInsert();
    }
  };

  return (
    <AppContainer>
      <Header>
        <Title>Binary Search Tree Visualization</Title>
      </Header>

      <ControlPanel>
        <ControlGroup>
          <Input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Enter a number"
          />
          <Button onClick={handleInsert}>
            Insert
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDelete}
            disabled={!inputValue}
          >
            Delete
          </Button>
          <Button 
            variant="success"
            onClick={handleSearch}
            disabled={!inputValue}
          >
            Search
          </Button>
        </ControlGroup>

        <Divider />

        <ControlGroup>
          <Button 
            variant="secondary"
            onClick={handleUndo}
            disabled={currentIndex === 0}
          >
            Undo
          </Button>
          <Button 
            variant="secondary"
            onClick={handleRedo}
            disabled={currentIndex === history.length - 1}
          >
            Redo
          </Button>
          <Button 
            variant="danger"
            onClick={handleClear}
            disabled={!currentData.nodes.length}
          >
            Clear
          </Button>
        </ControlGroup>
      </ControlPanel>
      
      <VisualizationContainer>
        <TreeVisualization 
          data={currentData}
          animations={history[currentIndex].animations}
          animationSpeed={800}
        />
      </VisualizationContainer>
    </AppContainer>
  );
};

export default App;
