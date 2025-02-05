import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { colors } from "../../styles/colors";

// Reuse styled components from BSTConcept
const Container = styled.div`
	padding: 40px 20px;
	max-width: 1200px;
	margin: 0 auto;
	@media (max-width: 768px) {
		padding: 20px 10px;
	}
`;

const Header = styled.header`
	margin-bottom: 40px;
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const BackLink = styled(Link)`
	color: ${colors.primary};
	text-decoration: none;
	display: flex;
	align-items: center;
	gap: 8px;
	font-weight: 500;
	padding: 8px 16px;
	border-radius: 8px;
	transition: all 0.2s;
	background: ${colors.surfaceLight};

	&:hover {
		background: ${colors.surface};
		transform: translateX(-4px);
		box-shadow: 0 2px 8px ${colors.shadow};
	}

	svg {
		stroke: ${colors.primary};
	}
`;

const Content = styled.div`
	background: white;
	border-radius: 12px;
	padding: 32px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	@media (max-width: 768px) {
		padding: 20px;
	}
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
	font-family: "Courier New", Courier, monospace;
`;

const ReferenceLink = styled.a`
	color: ${colors.primary};
	text-decoration: none;
	font-weight: 500;
	&:hover {
		text-decoration: underline;
	}
`;

export const AVLConcept: React.FC = () => {
	return (
		<Container>
			<Header>
				<Title>AVL Tree</Title>
				<BackLink to="/concept">
					<svg
						viewBox="0 0 24 24"
						width="24"
						height="24"
						fill="none"
						stroke="currentColor"
					>
						<path
							d="M19 12H5M12 19l-7-7 7-7"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
					Back to Concepts
				</BackLink>
			</Header>

			<Content>
				<Section>
					<SubTitle>What is an AVL Tree?</SubTitle>
					<Text>
						An AVL tree is a self-balancing binary search tree where the heights
						of the two child subtrees of any node differ by at most one. It's
						named after its inventors Adelson-Velsky and Landis.
					</Text>
					<Text>
						Key Property: For every node in the tree, the balance factor (height
						of left subtree - height of right subtree) must be -1, 0, or 1.
					</Text>
				</Section>

				<Section>
					<SubTitle>Balance Factor</SubTitle>
					<Text>The balance factor (BF) of a node is calculated as:</Text>
					<CodeBlock>
						BF = Height(Left Subtree) - Height(Right Subtree)
					</CodeBlock>
					<List>
						<li>BF = -1: Right subtree is higher</li>
						<li>BF = 0: Both subtrees have same height</li>
						<li>BF = 1: Left subtree is higher</li>
					</List>
				</Section>

				<Section>
					<SubTitle>Rotations</SubTitle>
					<Text>
						When the balance factor of a node becomes less than -1 or greater
						than 1, rotations are performed to rebalance the tree:
					</Text>
					<List>
						<li>
							<strong>Left Rotation:</strong> Used when right subtree becomes
							too heavy
						</li>
						<li>
							<strong>Right Rotation:</strong> Used when left subtree becomes
							too heavy
						</li>
						<li>
							<strong>Left-Right Rotation:</strong> Double rotation for
							left-right imbalance
						</li>
						<li>
							<strong>Right-Left Rotation:</strong> Double rotation for
							right-left imbalance
						</li>
					</List>
					<CodeBlock>{`
// Example Left Rotation
rightRotate(Node y) {
    Node x = y.left;
    Node T2 = x.right;

    x.right = y;
    y.left = T2;

    y.height = max(height(y.left), height(y.right)) + 1;
    x.height = max(height(x.left), height(x.right)) + 1;

    return x;
}`}</CodeBlock>
				</Section>

				<Section>
					<SubTitle>Operations</SubTitle>
					<Text>
						<strong>1. Insertion</strong>
					</Text>
					<List>
						<li>Insert like a normal BST</li>
						<li>Update heights of ancestors</li>
						<li>Check balance factor at each ancestor</li>
						<li>If unbalanced, perform appropriate rotation</li>
					</List>

					<Text>
						<strong>2. Deletion</strong>
					</Text>
					<List>
						<li>Delete like a normal BST</li>
						<li>Update heights of ancestors</li>
						<li>Check balance factor at each ancestor</li>
						<li>If unbalanced, perform appropriate rotation</li>
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
						Unlike regular BSTs, AVL trees guarantee O(log n) operations by
						maintaining balance.
					</Text>
				</Section>

				<Section>
					<SubTitle>Advantages and Disadvantages</SubTitle>
					<Text>
						<strong>Advantages:</strong>
					</Text>
					<List>
						<li>Guaranteed O(log n) search time</li>
						<li>Self-balancing</li>
						<li>Good for lookup-intensive applications</li>
					</List>

					<Text>
						<strong>Disadvantages:</strong>
					</Text>
					<List>
						<li>More complex implementation than BST</li>
						<li>Extra space for height information</li>
						<li>
							Rotations can be expensive for frequent insertions/deletions
						</li>
					</List>
				</Section>

				<Section>
					<SubTitle>Use Cases</SubTitle>
					<List>
						<li>Database indexing</li>
						<li>In-memory dictionaries</li>
						<li>Applications requiring guaranteed log(n) search time</li>
					</List>
				</Section>

				<Section>
					<SubTitle>References</SubTitle>
					<List>
						<li>
							<ReferenceLink
								href="https://en.wikipedia.org/wiki/AVL_tree"
								target="_blank"
							>
								Wikipedia: AVL Tree
							</ReferenceLink>
						</li>
						<li>
							<ReferenceLink
								href="https://www.geeksforgeeks.org/avl-tree-set-1-insertion/"
								target="_blank"
							>
								GeeksforGeeks: AVL Tree Insertion
							</ReferenceLink>
						</li>
						<li>
							<ReferenceLink
								href="https://www.programiz.com/dsa/avl-tree"
								target="_blank"
							>
								Programiz: AVL Tree
							</ReferenceLink>
						</li>
					</List>
				</Section>
			</Content>
		</Container>
	);
};

export default AVLConcept;
