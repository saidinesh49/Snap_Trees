import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { colors } from "../../styles/colors";

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

const Title = styled.h1`
	font-size: 32px;
	color: ${colors.headline};
	margin: 0;
`;

const Content = styled.div`
	background: ${colors.surface};
	padding: 32px;
	border-radius: 16px;
	box-shadow: 0 4px 12px ${colors.shadow};
	@media (max-width: 768px) {
		padding: 20px;
	}
`;

const Section = styled.section`
	margin-bottom: 32px;
`;

const SubTitle = styled.h2`
	font-size: 24px;
	color: ${colors.headline};
	margin: 0 0 16px;
`;

const Text = styled.p`
	color: ${colors.paragraph};
	line-height: 1.6;
	margin: 0 0 16px;
`;

const List = styled.ul`
	color: ${colors.paragraph};
	line-height: 1.6;
	margin: 0 0 24px;
	padding-left: 24px;

	li {
		margin-bottom: 8px;
	}
`;

const Code = styled.pre`
	background: ${colors.surfaceLight};
	padding: 20px;
	border-radius: 8px;
	overflow-x: auto;
	color: ${colors.paragraph};
	border: 1px solid ${colors.border};
`;

const ReferenceLink = styled.a`
	color: ${colors.primary};
	text-decoration: none;
	font-weight: 500;
	&:hover {
		text-decoration: underline;
	}
`;

const BSTConcept: React.FC = () => {
	return (
		<Container>
			<Header>
				<Title>Binary Search Tree</Title>
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
					<SubTitle>What is a Binary Search Tree?</SubTitle>
					<Text>
						A Binary Search Tree (BST) is a binary tree data structure with the
						following properties:
					</Text>
					<List>
						<li>
							The left subtree of a node contains only nodes with keys less than
							the node's key.
						</li>
						<li>
							The right subtree of a node contains only nodes with keys greater
							than the node's key.
						</li>
						<li>
							Both the left and right subtrees must also be binary search trees.
						</li>
					</List>
				</Section>

				<Section>
					<SubTitle>Basic Operations</SubTitle>

					<Text>
						<strong>1. Insertion</strong>
					</Text>
					<Text>To insert a new key into a BST:</Text>
					<List>
						<li>Start at the root</li>
						<li>Compare the key with current node</li>
						<li>If less, go left; if greater, go right</li>
						<li>Repeat until finding an empty spot</li>
					</List>
					<Code>
						{`// Example insertion
if (value < currentNode.value) {
    if (!currentNode.left) {
        currentNode.left = new Node(value);
    } else {
        insert(currentNode.left, value);
    }
}`}
					</Code>

					<Text>
						<strong>2. Search</strong>
					</Text>
					<Text>Searching follows a similar process to insertion:</Text>
					<List>
						<li>Start at root</li>
						<li>If current node has the key, return it</li>
						<li>If key is less than current node, search left subtree</li>
						<li>If key is greater than current node, search right subtree</li>
					</List>

					<Text>
						<strong>3. Deletion</strong>
					</Text>
					<Text>Deletion has three cases:</Text>
					<List>
						<li>Node is a leaf: Simply remove it</li>
						<li>Node has one child: Replace node with its child</li>
						<li>
							Node has two children: Find successor (smallest in right subtree),
							replace node with successor, delete successor
						</li>
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
					<Text>
						<strong>Advantages:</strong>
					</Text>
					<List>
						<li>Fast search, insertion, and deletion in average case</li>
						<li>Maintains sorted order of elements</li>
						<li>Simple implementation compared to other balanced trees</li>
					</List>

					<Text>
						<strong>Disadvantages:</strong>
					</Text>
					<List>
						<li>No guarantee of O(log n) operations (can become skewed)</li>
						<li>Not suitable when order statistics are frequently needed</li>
						<li>
							Requires additional balancing mechanisms for guaranteed
							performance
						</li>
					</List>
				</Section>

				<Section>
					<SubTitle>References</SubTitle>
					<List>
						<li>
							<ReferenceLink
								href="https://en.wikipedia.org/wiki/Binary_search_tree"
								target="_blank"
							>
								Wikipedia: Binary Search Tree
							</ReferenceLink>
						</li>
						<li>
							<ReferenceLink
								href="https://www.geeksforgeeks.org/binary-search-tree-data-structure/"
								target="_blank"
							>
								GeeksforGeeks: Binary Search Tree
							</ReferenceLink>
						</li>
						<li>
							<ReferenceLink
								href="https://www.programiz.com/dsa/binary-search-tree"
								target="_blank"
							>
								Programiz: Binary Search Tree
							</ReferenceLink>
						</li>
					</List>
				</Section>
			</Content>
		</Container>
	);
};

export default BSTConcept;
