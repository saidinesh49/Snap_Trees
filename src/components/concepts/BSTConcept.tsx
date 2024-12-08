import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Container = styled.div`
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.header`
  margin-bottom: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BackLink = styled(Link)`
  color: #4dabf7;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const Content = styled.div`
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const Section = styled.section`
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 32px;
  color: #1a1a1a;
  margin: 0;
`;

const SubTitle = styled.h2`
  font-size: 24px;
  color: #1a1a1a;
  margin: 0 0 16px;
`;

const Text = styled.p`
  color: #666;
  line-height: 1.6;
  margin: 0 0 16px;
`;

const List = styled.ul`
  color: #666;
  line-height: 1.6;
  margin: 0 0 16px;
  padding-left: 20px;
`;

const CodeBlock = styled.pre`
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 16px 0;
  font-family: 'Courier New', Courier, monospace;
`;

export const BSTConcept: React.FC = () => {
  return (
    <Container>
      <Header>
        <Title>Binary Search Tree (BST)</Title>
        <BackLink to="/concept">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Concepts
        </BackLink>
      </Header>

      <Content>
        <Section>
          <SubTitle>What is a Binary Search Tree?</SubTitle>
          <Text>
            A Binary Search Tree (BST) is a binary tree data structure with the following properties:
          </Text>
          <List>
            <li>The left subtree of a node contains only nodes with keys less than the node's key.</li>
            <li>The right subtree of a node contains only nodes with keys greater than the node's key.</li>
            <li>Both the left and right subtrees must also be binary search trees.</li>
          </List>
        </Section>

        <Section>
          <SubTitle>Basic Operations</SubTitle>
          
          <Text><strong>1. Insertion</strong></Text>
          <Text>
            To insert a new key into a BST:
          </Text>
          <List>
            <li>Start at the root</li>
            <li>Compare the key with current node</li>
            <li>If less, go left; if greater, go right</li>
            <li>Repeat until finding an empty spot</li>
          </List>
          <CodeBlock>{`
// Example insertion
if (value < currentNode.value) {
    if (!currentNode.left) {
        currentNode.left = new Node(value);
    } else {
        insert(currentNode.left, value);
    }
}`}</CodeBlock>

          <Text><strong>2. Search</strong></Text>
          <Text>
            Searching follows a similar process to insertion:
          </Text>
          <List>
            <li>Start at root</li>
            <li>If current node has the key, return it</li>
            <li>If key is less than current node, search left subtree</li>
            <li>If key is greater than current node, search right subtree</li>
          </List>

          <Text><strong>3. Deletion</strong></Text>
          <Text>
            Deletion has three cases:
          </Text>
          <List>
            <li>Node is a leaf: Simply remove it</li>
            <li>Node has one child: Replace node with its child</li>
            <li>Node has two children: Find successor (smallest in right subtree), replace node with successor, delete successor</li>
          </List>
        </Section>

        <Section>
          <SubTitle>Time Complexity</SubTitle>
          <List>
            <li>Search: O(h) where h is height of tree</li>
            <li>Insertion: O(h)</li>
            <li>Deletion: O(h)</li>
            <li>Best case (balanced tree): h = log(n)</li>
            <li>Worst case (skewed tree): h = n</li>
          </List>
        </Section>

        <Section>
          <SubTitle>Advantages and Disadvantages</SubTitle>
          <Text><strong>Advantages:</strong></Text>
          <List>
            <li>Fast search, insertion, and deletion in average case</li>
            <li>Maintains sorted order of elements</li>
            <li>Simple implementation compared to other balanced trees</li>
          </List>

          <Text><strong>Disadvantages:</strong></Text>
          <List>
            <li>No guarantee of O(log n) operations (can become skewed)</li>
            <li>Not suitable when order statistics are frequently needed</li>
            <li>Requires additional balancing mechanisms for guaranteed performance</li>
          </List>
        </Section>
      </Content>
    </Container>
  );
};

export default BSTConcept;