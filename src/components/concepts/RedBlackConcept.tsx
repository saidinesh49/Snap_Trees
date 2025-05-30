import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { colors } from "../../styles/colors";
import MadeWithLove from "../common/MadeWithLove";
import { BackButton, PrerequisiteLink as SharedPrerequisiteLink, ReferenceLink as SharedReferenceLink } from "./shared/ConceptStyles";

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

const PrerequisiteLink = styled(SharedPrerequisiteLink)``;

const RedBlackConcept: React.FC = () => {
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
				<Title>Red-Black Tree</Title>
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
							Prerequisite:
							<PrerequisiteLink to="/concept/BST">
								Binary Search Tree (BST)
								<svg
									viewBox="0 0 24 24"
									width="16"
									height="16"
									fill="none"
									stroke="currentColor"
								>
									<path
										d="M5 12h14M12 5l7 7-7 7"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</PrerequisiteLink>
						</PrerequisiteText>
					</Prerequisite>
					<SubTitle>What is a Red-Black Tree?</SubTitle>
					<Text>
						A Red-Black tree is a self-balancing binary search tree with the
						following properties:
					</Text>
					<List>
						<li>Every node is either red or black.</li>
						<li>The root is always black.</li>
						<li>All the nil nodes are considered to be double black.</li>
						<li>
							No two adjacent red nodes (i.e., a red node cannot have a red
							parent or red child).
						</li>
						<li>
							Every path from a node to its descendant nil nodes has the same
							number of black nodes.
						</li>
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

					<Text>
						<strong>1. Insertion</strong>
					</Text>
					<List>
						<li>Step 1: Insert like a normal BST</li>
						<li>Step 2: Color the new node RED</li>
						<li>
							Step 3: Fix any violations:
							<ul>
								<li>Case 1: Tree is empty → Color root BLACK</li>
								<li>Case 2: Parent is BLACK → No action needed</li>
								<li>
									Case 3: Parent and Uncle are RED → Recolor parent, uncle, and
									grandparent
								</li>
								<li>
									Case 4: Parent is RED, Uncle is BLACK (Triangle) → Single
									rotation
								</li>
								<li>
									Case 5: Parent is RED, Uncle is BLACK (Line) → Single rotation
									with recoloring
								</li>
							</ul>
						</li>
					</List>

					<SubTitle>1) Insertion</SubTitle>
					<Text>To insert a node in a Red-Black tree, follow these steps:</Text>
					<List>
						<li>Insert the node as in a regular BST.</li>
						<li>Color the new node red.</li>
						<li>Fix any violations of the Red-Black tree properties.</li>
					</List>
					<Text>Example:</Text>
					<List>
						<li>
							<strong>Insert 10:</strong> The tree is empty, so 10 becomes the
							root and is colored black.
							<br />
							<strong>Result:</strong>
							<Image
								src="/assets/RedBlack/Insertion_Images/RedBlack_img_1.png"
								alt="Insert 10"
								onClick={() =>
									handleImageClick(
										"/assets/RedBlack/Insertion_Images/RedBlack_img_1.png",
									)
								}
							/>
						</li>
						<li>
							<strong>Insert 18:</strong> Insert 18 to the right of 10 and color
							it red.
							<br />
							<strong>Result:</strong>
							<Image
								src="/assets/RedBlack/Insertion_Images/RedBlack_img_2.png"
								alt="Insert 18"
								onClick={() =>
									handleImageClick(
										"/assets/RedBlack/Insertion_Images/RedBlack_img_2.png",
									)
								}
							/>
						</li>
						<li>
							<strong>Insert 7:</strong> Insert 7 to the left of 10 and color it
							red.
							<br />
							<strong>Result:</strong>
							<Image
								src="/assets/RedBlack/Insertion_Images/RedBlack_img_3.png"
								alt="Insert 7"
								onClick={() =>
									handleImageClick(
										"/assets/RedBlack/Insertion_Images/RedBlack_img_3.png",
									)
								}
							/>
						</li>
						<li>
							<strong>Insert 15:</strong> Insert 15 to the left of 18 and color
							it red. This causes a red-red conflict., so here requires
							re-coloouring of 18 and 7 to black.
							<br />
							<strong>Result:</strong>
							<Image
								src="/assets/RedBlack/Insertion_Images/RedBlack_img_4.png"
								alt="Insert 15"
								onClick={() =>
									handleImageClick(
										"/assets/RedBlack/Insertion_Images/RedBlack_img_4.png",
									)
								}
							/>
						</li>
						<li>
							<strong>Insert 16:</strong> Insert 16 to the right of 15 and color
							it red. This causes another red-red conflict., so here to fix the
							conflict we need to perform rotations and recolor.
							<br />
							<strong>Result:</strong>
							<Image
								src="/assets/RedBlack/Insertion_Images/RedBlack_img_5.png"
								alt="Insert 16"
								onClick={() =>
									handleImageClick(
										"/assets/RedBlack/Insertion_Images/RedBlack_img_5.png",
									)
								}
							/>
						</li>
						<li>
							<strong>Insert 30:</strong> Insert 30 to the right of 18.,so here
							red-red conflict occurs., as parent & uncle both are also red., so
							simply re-color parent, uncle and grand-parent.
							<br />
							<strong>Result:</strong>
							<Image
								src="/assets/RedBlack/Insertion_Images/RedBlack_img_6.png"
								alt="Insert 30"
								onClick={() =>
									handleImageClick(
										"/assets/RedBlack/Insertion_Images/RedBlack_img_6.png",
									)
								}
							/>
						</li>
						<li>
							<strong>Insert 25:</strong> On inserting 25 to the left of 30.,
							red-red conflict occurs., so here as there is no-uncle means nil
							node..(NIL node = Double black)..,so here we need to perform
							Right-Left Rotation & then recoloring.
							<br />
							<strong>Result:</strong>
							<Image
								src="/assets/RedBlack/Insertion_Images/RedBlack_img_7.png"
								alt="Insert 25"
								onClick={() =>
									handleImageClick(
										"/assets/RedBlack/Insertion_Images/RedBlack_img_7.png",
									)
								}
							/>
						</li>
						<li>
							<strong>Insert 40:</strong> On inserting 40 to the right of 30.,
							red-red conflict occurs.,as the uncle of 40 that is 18 is red we
							need to recolor., then again conflict occurs at the 25., so here
							as the uncle of 25 is black.., we need to perform rotations and
							recoloring. where 16 becomes the parent of 10 & 25.
							<br />
							<strong>Result:</strong>
							<Image
								src="/assets/RedBlack/Insertion_Images/RedBlack_img_8.png"
								alt="Insert 40"
								onClick={() =>
									handleImageClick(
										"/assets/RedBlack/Insertion_Images/RedBlack_img_8.png",
									)
								}
							/>
						</li>
						<li>
							<strong>Insert 60:</strong> No violation on inserting 60.(So
							simply insert 60 to the right of 40)
							<br />
							<strong>Result:</strong>
							<Image
								src="/assets/RedBlack/Insertion_Images/RedBlack_img_9.png"
								alt="Insert 60"
								onClick={() =>
									handleImageClick(
										"/assets/RedBlack/Insertion_Images/RedBlack_img_9.png",
									)
								}
							/>
						</li>
						<li>
							<strong>Insert 2:</strong> No violation on inserting 2.(So simply
							insert 2 to the left of 7)
							<br />
							<strong>Result:</strong>
							<Image
								src="/assets/RedBlack/Insertion_Images/RedBlack_img_10.png"
								alt="Insert 2"
								onClick={() =>
									handleImageClick(
										"/assets/RedBlack/Insertion_Images/RedBlack_img_10.png",
									)
								}
							/>
						</li>
						<li>
							<strong>Insert 1:</strong> On inserting 1 to the left of 2.,
							red-red conflict occurs so here as the uncle of 1 is nil.., so we
							need to perform Right Rotation, where 2 becomes parent of 1 & 7.
							<br />
							<strong>Result:</strong>
							<Image
								src="/assets/RedBlack/Insertion_Images/RedBlack_img_11.png"
								alt="Insert 1"
								onClick={() =>
									handleImageClick(
										"/assets/RedBlack/Insertion_Images/RedBlack_img_11.png",
									)
								}
							/>
						</li>
						<li>
							<strong>Insert 70:</strong> On inserting 70 to the right of 60.,
							red-red conflict occurs. So as here the uncle of 70 is red., we
							need to perform re-coloring, as we continue checking for conflicts
							we again get red-red conflict at 40 & 25., so here we need to
							recolor 25 and its siblings.
							<br />
							<strong>Result:</strong>
							<Image
								src="/assets/RedBlack/Insertion_Images/RedBlack_img_12.png"
								alt="Insert 70"
								onClick={() =>
									handleImageClick(
										"/assets/RedBlack/Insertion_Images/RedBlack_img_12.png",
									)
								}
							/>
						</li>
					</List>
				</Section>

				<Section>
					<SubTitle>2) Deletion</SubTitle>
					<Text>To delete a node in a Red-Black tree, follow these steps:</Text>
					<List>
						<li>Perform standard BST deletion.</li>
						<li>If the deleted node is red, simply remove it.</li>
						<li>
							If the deleted node is black, fix any violations of the Red-Black
							tree properties.
						</li>
					</List>
					<Text>
						<strong>Steps for deletion</strong>
					</Text>
					<List>
						<li>Step 1: Find the node to delete</li>
						<li>
							Step 2: If node has two children:
							<ul>
								<li>Find in-order successor</li>
								<li>Copy successor's value to node</li>
								<li>Delete the successor instead</li>
							</ul>
						</li>
						<li>
							Step 3: Handle cases based on node colors:
							<ul>
								<li>Case 1: Deleting a RED node → Simple removal</li>
								<li>
									Case 2: Deleting a BLACK node → Need to fix double-black
									violation
								</li>
							</ul>
						</li>
						<li>
							Step 4: Fix double-black violations:
							<ul>
								<li>Case 1: Sibling is RED</li>
								<li>Case 2: Sibling and its children are BLACK</li>
								<li>Case 3: Sibling is BLACK with one RED child</li>
								<li>
									Case 4: Sibling is BLACK with RED child on opposite side
								</li>
							</ul>
						</li>
					</List>
					<Text>Example:</Text>
					<List>
						<div>
							<ImageContainer>
								<strong>Original tree before any deletion:</strong>
								<br />
								<Image
									src="/assets/RedBlack/Insertion_Images/RedBlack_img_12.png"
									alt="Original Tree"
									onClick={() =>
										handleImageClick(
											"/assets/RedBlack/Insertion_Images/RedBlack_img_12.png",
										)
									}
								/>
							</ImageContainer>
						</div>
						<li>
							<strong>Delete 16 (root):</strong> Replace the in-order successor
							(right sub-tree smallest element) which is 18..,(you can also take
							in-order predecessor which is left sub-tree greatest element).,
							and then delete that replaced node instead.
							<br />
							<strong>Result:</strong>
							<Image
								src="/assets/RedBlack/Deletion_Images/RedBlack_Del_1.png"
								alt="Delete 16"
								onClick={() =>
									handleImageClick(
										"/assets/RedBlack/Deletion_Images/RedBlack_Del_1.png",
									)
								}
							/>
						</li>
						<li>
							<strong>Delete 40:</strong> Replace 40 with its in-order
							successor., here which is 60, and then delete that replaced node
							instead.
							<br />
							<strong>Result:</strong>
							<Image
								src="/assets/RedBlack/Deletion_Images/RedBlack_Del_2.png"
								alt="Delete 40"
								onClick={() =>
									handleImageClick(
										"/assets/RedBlack/Deletion_Images/RedBlack_Del_2.png",
									)
								}
							/>
						</li>
						<li>
							<strong>Delete 10:</strong> Replace 10 with its in-order
							successor., here which is 15(Black).
							<br />
							<strong>Result:</strong>
							<Image
								src="/assets/RedBlack/Deletion_Images/RedBlack_Del_3.png"
								alt="Delete 10"
								onClick={() =>
									handleImageClick(
										"/assets/RedBlack/Deletion_Images/RedBlack_Del_3.png",
									)
								}
							/>
						</li>
					</List>
				</Section>

				<Section>
					<SubTitle>3) Searching:</SubTitle>
					<List>
						<li>Identical to regular BST search</li>
						<li>Colors don't affect the search process</li>
						<li>O(log n) time complexity guaranteed</li>
					</List>
				</Section>

				<Section>
					<SubTitle>Time Complexity</SubTitle>
					<List>
						<li>
							<strong>Search:</strong> O(log n) - Due to balanced height
						</li>
						<li>
							<strong>Insert:</strong> O(log n) - BST insert + at most 2
							rotations
						</li>
						<li>
							<strong>Delete:</strong> O(log n) - BST delete + at most 3
							rotations
						</li>
						<li>
							<strong>Space:</strong> O(n) - For storing n nodes
						</li>
					</List>
				</Section>

				<Section>
					<SubTitle>Advantages</SubTitle>
					<List>
						<li>Guaranteed O(log n) height</li>
						<li>
							More efficient than AVL trees for frequent insertions/deletions
						</li>
						<li>Fewer rotations compared to AVL trees</li>
						<li>
							Good balance between balance maintenance and operation efficiency
						</li>
					</List>
				</Section>

				<Section>
					<SubTitle>Real-world Applications</SubTitle>
					<List>
						<li>
							<strong>Java Collections:</strong> TreeMap and TreeSet
							implementations
						</li>
						<li>
							<strong>Linux Kernel:</strong> Completely Fair Scheduler (CFS)
						</li>
						<li>
							<strong>Database Systems:</strong> For indexing and maintaining
							sorted data
						</li>
						<li>
							<strong>File Systems:</strong> In many modern file system
							implementations
						</li>
						<li>
							<strong>C++ STL:</strong> map and set implementations
						</li>
					</List>
				</Section>

				<Section>
					<SubTitle>Comparison with Other Trees</SubTitle>
					<Text>
						<strong>Red-Black Tree vs Binary Search Tree:</strong>
					</Text>
					<List>
						<li>Red-Black Tree has a more balanced structure</li>
						<li>Red-Black Tree guarantees performance</li>
						<li>Red-Black Tree has higher memory usage (color bit)</li>
					</List>

					<Text>
						<strong>Red-Black Tree vs AVL Tree:</strong>
					</Text>
					<List>
						<li>Red-Black Tree is less strictly balanced</li>
						<li>Red-Black Tree has fewer rotations on modifications</li>
						<li>Red-Black Tree is better for write-heavy applications</li>
						<li>
							Red-Black Tree is slightly worse for read-heavy applications
						</li>
					</List>
				</Section>

				<Section>
					<SubTitle>More References</SubTitle>
					<List>
						<li>
							<a
								href="https://en.wikipedia.org/wiki/Red%E2%80%93black_tree"
								target="_blank"
								rel="noopener noreferrer"
								style={{
									color: colors.headline,
									textDecoration: 'underline',
									fontWeight: 500
								}}
							>
								Wikipedia: Red-Black Tree
							</a>
						</li>
						<li>
							<a
								href="https://www.geeksforgeeks.org/red-black-tree-set-1-introduction-2/"
								target="_blank"
								rel="noopener noreferrer"
								style={{
									color: colors.headline,
									textDecoration: 'underline',
									fontWeight: 500
								}}
							>
								GeeksforGeeks: Red-Black Tree
							</a>
						</li>
						<li>
							<a
								href="https://www.tutorialspoint.com/data_structures_algorithms/red_black_trees.htm"
								target="_blank"
								rel="noopener noreferrer"
								style={{
									color: colors.headline,
									textDecoration: 'underline',
									fontWeight: 500
								}}
							>
								TutorialsPoint: Red-Black Tree
							</a>
						</li>
					</List>
				</Section>
			</Content>
			<MadeWithLove />
			{previewSrc && (
				<ImagePreview show={!!previewSrc} onClick={handleClosePreview}>
					<img src={previewSrc} alt="Preview" />
				</ImagePreview>
			)}
		</Container>
	);
};

export default RedBlackConcept;
