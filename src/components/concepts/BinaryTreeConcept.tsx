import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { colors } from "../../styles/colors";
import MadeWithLove from "../common/MadeWithLove";
import { BackButton, ReferenceLink as SharedReferenceLink } from "./shared/ConceptStyles";

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

const BackLink = styled(BackButton)``;

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

const ReferenceLink = styled(SharedReferenceLink)``;

const Prerequisite = styled.div`
	margin-bottom: 32px;
`;

const PrerequisiteText = styled.strong`
	display: flex;
	align-items: center;
	gap: 8px;
	font-size: 18px;
	color: #1a1a1a;
`;

const BinaryTreeConcept: React.FC = () => {
	return (
		<Container>
			<Header>
				<Title>Binary Tree</Title>
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
					<Prerequisite>
						<PrerequisiteText>
							<strong>Prerequisite:</strong> None
						</PrerequisiteText>
					</Prerequisite>
					<SubTitle>What is a Binary Tree?</SubTitle>
					<Text>
						A Binary Tree is a tree data structure in which each node has at
						most two children, referred to as the left child and the right
						child.
					</Text>
				</Section>

				<Section>
					<SubTitle>Node Structure</SubTitle>
					<Text>Each node in a Binary Tree contains:</Text>
					<List>
						<li>A value/key</li>
						<li>Left child pointer</li>
						<li>Right child pointer</li>
					</List>
					<CodeBlock>
						{`interface BinaryTreeNode {
  value: number;
  left: BinaryTreeNode | null;
  right: BinaryTreeNode | null;
}`}
					</CodeBlock>
				</Section>

				<Section>
					<SubTitle>Types of Binary Trees</SubTitle>
					<List>
						<li>
							<strong>Full Binary Tree:</strong> Every node has 0 or 2 children.
						</li>
						<li>
							<strong>Complete Binary Tree:</strong> All levels are completely
							filled except possibly the last level, and the last level has all
							nodes as left as possible.
						</li>
						<li>
							<strong>Perfect Binary Tree:</strong> All internal nodes have two
							children and all leaves are at the same level.
						</li>
						<li>
							<strong>Balanced Binary Tree:</strong> The height of the tree is
							O(log n) where n is the number of nodes.
						</li>
						<li>
							<strong>Degenerate (or pathological) Tree:</strong> Each parent
							node has only one child, resembling a linked list.
						</li>
					</List>
				</Section>

				<Section>
					<SubTitle>Tree Traversal</SubTitle>
					<Text>There are several ways to traverse a binary tree:</Text>
					<List>
						<li>
							<strong>In-order Traversal:</strong> Visit the left subtree, the
							root, and then the right subtree.
						</li>
						<li>
							<strong>Pre-order Traversal:</strong> Visit the root, the left
							subtree, and then the right subtree.
						</li>
						<li>
							<strong>Post-order Traversal:</strong> Visit the left subtree, the
							right subtree, and then the root.
						</li>
						<li>
							<strong>Level-order Traversal:</strong> Visit nodes level by
							level.
						</li>
					</List>
				</Section>

				<Section>
					<SubTitle>Applications</SubTitle>
					<List>
						<li>Expression trees</li>
						<li>Binary search trees</li>
						<li>Heaps</li>
						<li>Syntax trees</li>
						<li>Huffman coding trees</li>
					</List>
				</Section>

				<Section>
					<SubTitle>References</SubTitle>
					<List>
						<li>
							<a
								href="https://en.wikipedia.org/wiki/Binary_tree"
								target="_blank"
								rel="noopener noreferrer"
								style={{
									color: colors.headline,
									textDecoration: 'underline',
									fontWeight: 500
								}}
							>
								Wikipedia: Binary Tree
							</a>
						</li>
						<li>
							<a
								href="https://www.geeksforgeeks.org/binary-tree-data-structure/"
								target="_blank"
								rel="noopener noreferrer"
								style={{
									color: colors.headline,
									textDecoration: 'underline',
									fontWeight: 500
								}}
							>
								GeeksforGeeks: Binary Tree
							</a>
						</li>
						<li>
							<a
								href="https://www.tutorialspoint.com/data_structures_algorithms/binary_tree_algorithms.htm"
								target="_blank"
								rel="noopener noreferrer"
								style={{
									color: colors.headline,
									textDecoration: 'underline',
									fontWeight: 500
								}}
							>
								TutorialsPoint: Binary Tree
							</a>
						</li>
					</List>
				</Section>
			</Content>

			<MadeWithLove />
		</Container>
	);
};

export default BinaryTreeConcept;
