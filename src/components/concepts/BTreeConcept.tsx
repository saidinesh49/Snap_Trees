import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

// Reuse styled components from previous concepts
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

export const BTreeConcept: React.FC = () => {
  return (
    <Container>
      <Header>
        <Title>B-Tree</Title>
        <BackLink to="/concept">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Concepts
        </BackLink>
      </Header>

      <Content>
        <Section>
          <SubTitle>What is a B-Tree?</SubTitle>
          <Text>
            A B-tree is a self-balancing tree data structure that maintains sorted data and allows searches, sequential access, insertions, and deletions in logarithmic time. It's optimized for systems that read and write large blocks of data.
          </Text>
          <Text>
            Unlike binary trees, a B-tree node can have more than two children, making it efficient for storage systems like databases and file systems.
          </Text>
        </Section>

        <Section>
          <SubTitle>Properties</SubTitle>
          <Text>For a B-tree of order m:</Text>
          <List>
            <li>Every node has at most m children</li>
            <li>Every non-leaf node (except root) has at least ⌈m/2⌉ children</li>
            <li>The root has at least 2 children if it's not a leaf</li>
            <li>All leaves appear at the same level</li>
            <li>A non-leaf node with k children contains k-1 keys</li>
          </List>
        </Section>

        <Section>
          <SubTitle>Node Structure</SubTitle>
          <CodeBlock>{`
interface BTreeNode {
    keys: number[];      // Array of keys
    children: Node[];    // Array of child pointers
    isLeaf: boolean;     // Whether node is a leaf
    n: number;          // Number of keys currently stored
}`}</CodeBlock>
        </Section>

        <Section>
          <SubTitle>Operations</SubTitle>
          
          <Text><strong>1. Search</strong></Text>
          <List>
            <li>Start from root</li>
            <li>Use binary search within node's keys</li>
            <li>Follow appropriate child pointer</li>
            <li>Repeat until key is found or leaf is reached</li>
          </List>

          <Text><strong>2. Insertion</strong></Text>
          <List>
            <li>Find appropriate leaf node</li>
            <li>If node has space, insert key</li>
            <li>If node is full, split node:</li>
            <li>- Move median key to parent</li>
            <li>- Create new node with right half</li>
            <li>Split may propagate up to root</li>
          </List>

          <Text><strong>3. Deletion</strong></Text>
          <List>
            <li>If key in leaf, simply remove</li>
            <li>If key in internal node:</li>
            <li>- Replace with predecessor/successor</li>
            <li>- Delete predecessor/successor from leaf</li>
            <li>Handle underflow by:</li>
            <li>- Borrowing from sibling</li>
            <li>- Merging with sibling</li>
          </List>
        </Section>

        <Section>
          <SubTitle>Time Complexity</SubTitle>
          <List>
            <li>Search: O(log n)</li>
            <li>Insertion: O(log n)</li>
            <li>Deletion: O(log n)</li>
          </List>
          <Text>
            All operations are guaranteed to be logarithmic because the tree remains balanced through splits and merges.
          </Text>
        </Section>

        <Section>
          <SubTitle>Advantages</SubTitle>
          <List>
            <li>Maintains sorted data</li>
            <li>Guaranteed logarithmic operations</li>
            <li>Good for systems with large data blocks</li>
            <li>Minimizes disk I/O operations</li>
            <li>Efficient for range queries</li>
          </List>
        </Section>

        <Section>
          <SubTitle>Use Cases</SubTitle>
          <List>
            <li>Database indexing (e.g., MySQL uses B+ trees)</li>
            <li>File systems (e.g., NTFS, ext4)</li>
            <li>Large-scale storage systems</li>
            <li>Systems requiring efficient range queries</li>
          </List>
        </Section>

        <Section>
          <SubTitle>Comparison with Other Trees</SubTitle>
          <Text><strong>vs Binary Search Tree:</strong></Text>
          <List>
            <li>More children per node</li>
            <li>Better for disk access</li>
            <li>Always balanced</li>
          </List>

          <Text><strong>vs AVL Tree:</strong></Text>
          <List>
            <li>More keys per node</li>
            <li>Less frequent rebalancing</li>
            <li>Better for external storage</li>
          </List>
        </Section>
      </Content>
    </Container>
  );
};

export default BTreeConcept;