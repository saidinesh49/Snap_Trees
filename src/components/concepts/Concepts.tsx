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

const Title = styled.h1`
  font-size: 32px;
  color: #1a1a1a;
  margin: 0;
`;

const ConceptGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
`;

const ConceptCard = styled(Link)`
  padding: 24px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
`;

const ConceptTitle = styled.h2`
  font-size: 24px;
  margin: 0 0 16px;
  color: #1a1a1a;
`;

const ConceptDescription = styled.p`
  margin: 0 0 16px;
  color: #666;
  line-height: 1.5;
`;

const LearnMore = styled.span`
  color: #4dabf7;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
`;

export const Concepts: React.FC = () => {
  return (
    <Container>
      <Header>
        <Title>Tree Data Structures</Title>
        <BackLink to="/">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Visualization
        </BackLink>
      </Header>

      <ConceptGrid>
        <ConceptCard to="/concept/BST">
          <ConceptTitle>Binary Search Tree</ConceptTitle>
          <ConceptDescription>
            A binary tree with the property that the key in each node is greater than all keys in its left subtree and less than all keys in its right subtree.
          </ConceptDescription>
          <LearnMore>
            Learn More
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor">
              <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </LearnMore>
        </ConceptCard>

        <ConceptCard to="/concept/AVL">
          <ConceptTitle>AVL Tree</ConceptTitle>
          <ConceptDescription>
            A self-balancing binary search tree where the heights of the two child subtrees of any node differ by at most one.
          </ConceptDescription>
          <LearnMore>
            Learn More
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor">
              <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </LearnMore>
        </ConceptCard>

        <ConceptCard to="/concept/RedBlack">
          <ConceptTitle>Red-Black Tree</ConceptTitle>
          <ConceptDescription>
            A self-balancing binary search tree with one extra bit per node for color, ensuring the tree remains balanced during operations.
          </ConceptDescription>
          <LearnMore>
            Learn More
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor">
              <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </LearnMore>
        </ConceptCard>

        <ConceptCard to="/concept/BTree">
          <ConceptTitle>B-Tree</ConceptTitle>
          <ConceptDescription>
            A self-balancing tree data structure that maintains sorted data and allows searches, sequential access, insertions, and deletions in logarithmic time.
          </ConceptDescription>
          <LearnMore>
            Learn More
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor">
              <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </LearnMore>
        </ConceptCard>
      </ConceptGrid>
    </Container>
  );
};

export default Concepts;