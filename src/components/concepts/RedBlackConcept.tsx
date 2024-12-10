import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

// Reuse styled components from other concepts
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
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Title = styled.h1`
  font-size: 32px;
  color: #1a1a1a;
  margin: 0 0 24px 0;
`;

const Section = styled.section`
  margin-bottom: 32px;
`;

const SubTitle = styled.h2`
  font-size: 24px;
  color: #1a1a1a;
  margin: 24px 0 16px 0;
`;

const Text = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: #4a4a4a;
  margin-bottom: 16px;
`;

const List = styled.ul`
  margin: 0 0 16px 20px;
  padding-left: 0;

  li {
    margin-bottom: 12px;
    line-height: 1.6;
    color: #4a4a4a;
  }

  ul {
    margin: 8px 0 8px 20px;
  }
`;

const CodeBlock = styled.pre`
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 16px 0;
  font-family: 'Courier New', Courier, monospace;
`;

const RedBlackConcept: React.FC = () => {
  return (
    <Container>
      <Header>
        <BackLink to="/concept">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Concepts
        </BackLink>
      </Header>

      <Content>
        <Title>Red-Black Trees: A Comprehensive Guide</Title>

        <Section>
          <SubTitle>Introduction</SubTitle>
          <Text>
            A Red-Black tree is a type of self-balancing binary search tree where each node has an extra bit 
            representing color (either red or black). These colors help maintain the tree's balance during 
            operations like insertion and deletion.
          </Text>
        </Section>

        <Section>
          <SubTitle>Fundamental Properties</SubTitle>
          <List>
            <li><strong>Property 1:</strong> Every node must be either RED or BLACK</li>
            <li><strong>Property 2:</strong> The root must always be BLACK</li>
            <li><strong>Property 3:</strong> All NULL leaves are considered BLACK</li>
            <li><strong>Property 4:</strong> A RED node cannot have RED children (No consecutive RED nodes)</li>
            <li><strong>Property 5:</strong> Every path from root to any NULL leaf must contain the same number of BLACK nodes (Black Height)</li>
          </List>
        </Section>

        <Section>
          <SubTitle>Node Structure</SubTitle>
          <Text>Each node in a Red-Black tree contains:</Text>
          <List>
            <li>A value/key</li>
            <li>Color (RED or BLACK)</li>
            <li>Left child pointer</li>
            <li>Right child pointer</li>
            <li>Parent pointer (optional but helpful)</li>
          </List>
          <CodeBlock>
{`interface RBNode {
  value: number;
  color: 'RED' | 'BLACK';
  left: RBNode | null;
  right: RBNode | null;
  parent: RBNode | null;
}`}
          </CodeBlock>
        </Section>

        <Section>
          <SubTitle>Operations</SubTitle>
          
          <Text><strong>1. Insertion</strong></Text>
          <List>
            <li>Step 1: Insert like a normal BST</li>
            <li>Step 2: Color the new node RED</li>
            <li>Step 3: Fix any violations:
              <ul>
                <li>Case 1: Tree is empty → Color root BLACK</li>
                <li>Case 2: Parent is BLACK → No action needed</li>
                <li>Case 3: Parent and Uncle are RED → Recolor parent, uncle, and grandparent</li>
                <li>Case 4: Parent is RED, Uncle is BLACK (Triangle) → Single rotation</li>
                <li>Case 5: Parent is RED, Uncle is BLACK (Line) → Single rotation with recoloring</li>
              </ul>
            </li>
          </List>

          <Text><strong>2. Deletion</strong></Text>
          <List>
            <li>Step 1: Find the node to delete</li>
            <li>Step 2: If node has two children:
              <ul>
                <li>Find in-order successor</li>
                <li>Copy successor's value to node</li>
                <li>Delete the successor instead</li>
              </ul>
            </li>
            <li>Step 3: Handle cases based on node colors:
              <ul>
                <li>Case 1: Deleting a RED node → Simple removal</li>
                <li>Case 2: Deleting a BLACK node → Need to fix double-black violation</li>
              </ul>
            </li>
            <li>Step 4: Fix double-black violations:
              <ul>
                <li>Case 1: Sibling is RED</li>
                <li>Case 2: Sibling and its children are BLACK</li>
                <li>Case 3: Sibling is BLACK with one RED child</li>
                <li>Case 4: Sibling is BLACK with RED child on opposite side</li>
              </ul>
            </li>
          </List>

          <Text><strong>3. Search</strong></Text>
          <List>
            <li>Identical to regular BST search</li>
            <li>Colors don't affect the search process</li>
            <li>O(log n) time complexity guaranteed</li>
          </List>
        </Section>

        <Section>
          <SubTitle>Time Complexity</SubTitle>
          <List>
            <li><strong>Search:</strong> O(log n) - Due to balanced height</li>
            <li><strong>Insert:</strong> O(log n) - BST insert + at most 2 rotations</li>
            <li><strong>Delete:</strong> O(log n) - BST delete + at most 3 rotations</li>
            <li><strong>Space:</strong> O(n) - For storing n nodes</li>
          </List>
        </Section>

        <Section>
          <SubTitle>Advantages</SubTitle>
          <List>
            <li>Guaranteed O(log n) height</li>
            <li>More efficient than AVL trees for frequent insertions/deletions</li>
            <li>Fewer rotations compared to AVL trees</li>
            <li>Good balance between balance maintenance and operation efficiency</li>
          </List>
        </Section>

        <Section>
          <SubTitle>Real-world Applications</SubTitle>
          <List>
            <li><strong>Java Collections:</strong> TreeMap and TreeSet implementations</li>
            <li><strong>Linux Kernel:</strong> Completely Fair Scheduler (CFS)</li>
            <li><strong>Database Systems:</strong> For indexing and maintaining sorted data</li>
            <li><strong>File Systems:</strong> In many modern file system implementations</li>
            <li><strong>C++ STL:</strong> map and set implementations</li>
          </List>
        </Section>

        <Section>
          <SubTitle>Comparison with Other Trees</SubTitle>
          <Text><strong>vs Binary Search Tree:</strong></Text>
          <List>
            <li>More balanced structure</li>
            <li>Guaranteed performance</li>
            <li>Higher memory usage (color bit)</li>
          </List>

          <Text><strong>vs AVL Tree:</strong></Text>
          <List>
            <li>Less strictly balanced</li>
            <li>Fewer rotations on modifications</li>
            <li>Better for write-heavy applications</li>
            <li>Slightly worse for read-heavy applications</li>
          </List>
        </Section>
      </Content>
    </Container>
  );
};

export default RedBlackConcept; 