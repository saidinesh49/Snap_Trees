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

const Image = styled.img`
	width: 100%;
	max-width: 600px;
	margin: 16px 0;
	cursor: pointer;
	border-radius: 8px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	transition: transform 0.2s;

	&:hover {
		transform: scale(1.05);
	}
`;

const ImagePreview = styled.div`
	display: ${({ show }: { show: boolean }) => (show ? "flex" : "none")};
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.8);
	justify-content: center;
	align-items: center;
	z-index: 1000;

	img {
		max-width: 90%;
		max-height: 90%;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}
`;

const ImageContainer = styled.div`
	border: 1px solid #ddd;
	padding: 16px;
	border-radius: 8px;
	margin-bottom: 16px;
	background: #f9f9f9;
`;

const BSTConcept: React.FC = () => {
	const [previewSrc, setPreviewSrc] = React.useState<string | null>(null);

	const handleImageClick = (src: string) => {
		setPreviewSrc(src);
	};

	const handleClosePreview = () => {
		setPreviewSrc(null);
	};

	return (
		<Container>
			<Header>
				<Title>Binary Search Tree (BST)</Title>
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
						A Binary Search Tree (BST) is a node-based binary tree data
						structure where each node has at most two children, referred to as
						the left child and the right child. For each node:
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
					<SubTitle>Node Structure</SubTitle>
					<Text>Each node in a BST contains:</Text>
					<List>
						<li>A value/key</li>
						<li>Left child pointer</li>
						<li>Right child pointer</li>
						<li>Parent pointer (optional but helpful)</li>
					</List>
					<CodeBlock>
						{`interface BSTNode {
  value: number;
  left: BSTNode | null;
  right: BSTNode | null;
  parent: BSTNode | null;
}`}
					</CodeBlock>
				</Section>

				<Section>
					<SubTitle>Operations</SubTitle>

					<Text>
						<strong>1. Insertion</strong>
					</Text>
					<List>
						<li>
							Step 1: Start at the root and compare the value to be inserted
							with the current node's value.
						</li>
						<li>
							Step 2: If the value is less than the current node's value, move
							to the left sub-tree.
						</li>
						<li>
							Step 3: If the value is greater than the current node's value,
							move to the right sub-tree.
						</li>
						<li>
							Step 4: Repeat steps 2 and 3 until you find an empty spot to
							insert the new node (reach to the leaf).
						</li>
					</List>
					<Text>Example:</Text>
					<List>
						<li>
							<strong>Insert 10:</strong> The tree is empty, so 10 becomes the
							root.
							<br />
							<strong>Result:</strong>
							<Image
								src="/assets/BST/Insertion/BST_img_1.png"
								alt="Insert 10"
								onClick={() =>
									handleImageClick("/assets/BST/Insertion/BST_img_1.png")
								}
							/>
						</li>
						<li>
							<strong>Insert 5:</strong> As 5 is less than 10, move to the left
							subtree of 10.., and insert 5.
							<br />
							<strong>Result:</strong>
							<Image
								src="/assets/BST/Insertion/BST_img_2.png"
								alt="Insert 5"
								onClick={() =>
									handleImageClick("/assets/BST/Insertion/BST_img_2.png")
								}
							/>
						</li>
						<li>
							<strong>Insert 15:</strong> As 15 is greater than 10, move to the
							right subtree of 10.., and insert 15.
							<br />
							<strong>Result:</strong>
							<Image
								src="/assets/BST/Insertion/BST_img_3.png"
								alt="Insert 15"
								onClick={() =>
									handleImageClick("/assets/BST/Insertion/BST_img_3.png")
								}
							/>
						</li>
						<li>
							<strong>Insert 3:</strong> As 3 is less than 10, move to the left
							subtree of 10. Then, as 3 is less than 5, move to the left subtree
							of 5.., and insert 3.
							<br />
							<strong>Result:</strong>
							<Image
								src="/assets/BST/Insertion/BST_img_4.png"
								alt="Insert 3"
								onClick={() =>
									handleImageClick("/assets/BST/Insertion/BST_img_4.png")
								}
							/>
						</li>
						<li>
							<strong>Insert 7:</strong> As 7 is less than 10, move to the left
							subtree of 10. Then, as 7 is greater than 5, move to the right
							subtree of 5.., and insert 7.
							<br />
							<strong>Result:</strong>
							<Image
								src="/assets/BST/Insertion/BST_img_5.png"
								alt="Insert 7"
								onClick={() =>
									handleImageClick("/assets/BST/Insertion/BST_img_5.png")
								}
							/>
						</li>
						<li>
							<strong>Insert 12:</strong> As 12 is greater than 10, move to the
							right subtree of 10. Then, as 12 is less than 15, move to the left
							subtree of 15.., and insert 12.
							<br />
							<strong>Result:</strong>
							<Image
								src="/assets/BST/Insertion/BST_img_6.png"
								alt="Insert 12"
								onClick={() =>
									handleImageClick("/assets/BST/Insertion/BST_img_6.png")
								}
							/>
						</li>
						<li>
							<strong>Insert 18:</strong> As 18 is greater than 10, move to the
							right subtree of 10. Then, as 18 is greater than 15, move to the
							right subtree of 15.., and insert 18.
							<br />
							<strong>Result:</strong>
							<Image
								src="/assets/BST/Insertion/BST_img_7.png"
								alt="Insert 18"
								onClick={() =>
									handleImageClick("/assets/BST/Insertion/BST_img_7.png")
								}
							/>
						</li>
					</List>
				</Section>

				<Section>
					<SubTitle>Deletion</SubTitle>
					<Text>To delete a node in a BST, follow these steps:</Text>
					<List>
						<li>Step 1: Find the node to delete.</li>
						<li>Step 2: If the node has no children, simply remove it.</li>
						<li>
							Step 3: If the node has one child, replace the node with its
							child.
						</li>
						<li>
							Step 4: If the node has two children, find the in-order successor
							(smallest node in the right subtree) or in-order predecessor
							(largest node in the left subtree), copy its value to the node,
							and delete the successor or predecessor instead.
						</li>
					</List>
					<Text>Example:</Text>
					<List>
						<div>
							<ImageContainer>
								<strong>Original tree before any deletion:</strong>
								<Image
									src="/assets/BST/Insertion/BST_img_7.png"
									alt="Original Tree"
									onClick={() =>
										handleImageClick("/assets/BST/Insertion/BST_img_7.png")
									}
								/>
							</ImageContainer>
						</div>
						<li>
							<strong>Delete 15:</strong> Remove the node with value 15. Since
							it has two children, replace it with its in-order successor
							(smallest node in the right subtree).
							<br />
							<strong>Result:</strong>
							<Image
								src="/assets/BST/Deletion/BST_Del_1.png"
								alt="Delete 15"
								onClick={() =>
									handleImageClick("/assets/BST/Deletion/BST_Del_1.png")
								}
							/>
						</li>
						<li>
							<strong>Delete 12:</strong> Remove the node with value 12. Since
							it has no children, simply remove it.
							<br />
							<strong>Result:</strong>
							<Image
								src="/assets/BST/Deletion/BST_Del_2.png"
								alt="Delete 12"
								onClick={() =>
									handleImageClick("/assets/BST/Deletion/BST_Del_2.png")
								}
							/>
						</li>
						<li>
							<strong>Delete 5:</strong> Remove the node with value 5. Since it
							has two children, replace it with its in-order successor (smallest
							node in the right subtree).
							<br />
							<strong>Result:</strong>
							<Image
								src="/assets/BST/Deletion/BST_Del_3.png"
								alt="Delete 5"
								onClick={() =>
									handleImageClick("/assets/BST/Deletion/BST_Del_3.png")
								}
							/>
						</li>
					</List>
				</Section>

				<Section>
					<SubTitle>Searching</SubTitle>
					<List>
						<li>
							Start at the root and compare the target value with the current
							node's value.
						</li>
						<li>
							If the target value is less than the current node's value, move to
							the left child.
						</li>
						<li>
							If the target value is greater than the current node's value, move
							to the right child.
						</li>
						<li>
							Repeat steps 2 and 3 until you find the target value or reach a
							null node.
						</li>
					</List>
				</Section>

				<Section>
					<SubTitle>Time Complexity</SubTitle>
					<List>
						<li>
							<strong>Search:</strong> O(log n) - Due to balanced height
						</li>
						<li>
							<strong>Insert:</strong> O(log n) - BST insert
						</li>
						<li>
							<strong>Delete:</strong> O(log n) - BST delete
						</li>
						<li>
							<strong>Space:</strong> O(n) - For storing n nodes
						</li>
					</List>
				</Section>

				<Section>
					<SubTitle>Advantages</SubTitle>
					<List>
						<li>Simple implementation</li>
						<li>Efficient for search, insert, and delete operations</li>
						<li>
							Can be used as a building block for more complex data structures
						</li>
					</List>
				</Section>

				<Section>
					<SubTitle>Real-world Applications</SubTitle>
					<List>
						<li>Database indexing</li>
						<li>In-memory dictionaries</li>
						<li>
							Applications requiring efficient search, insert, and delete
							operations
						</li>
					</List>
				</Section>

				<Section>
					<SubTitle>Comparison with Other Trees</SubTitle>
					<Text>
						<strong>BST vs Red-Black Tree:</strong>
					</Text>
					<List>
						<li>BST is simpler to implement</li>
						<li>Red-Black Tree guarantees balanced height</li>
						<li>Red-Black Tree has better worst-case performance</li>
					</List>

					<Text>
						<strong>BST vs AVL Tree:</strong>
					</Text>
					<List>
						<li>BST is simpler to implement</li>
						<li>AVL Tree guarantees balanced height</li>
						<li>AVL Tree has better worst-case performance</li>
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
								href="https://www.tutorialspoint.com/data_structures_algorithms/binary_search_tree.htm"
								target="_blank"
							>
								TutorialsPoint: Binary Search Tree
							</ReferenceLink>
						</li>
					</List>
				</Section>
			</Content>

			{previewSrc && (
				<ImagePreview show={!!previewSrc} onClick={handleClosePreview}>
					<img src={previewSrc} alt="Preview" />
				</ImagePreview>
			)}
		</Container>
	);
};

export default BSTConcept;
