import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { colors } from "../../styles/colors"; //ok
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

const AVLConcept: React.FC = () => {
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
					<SubTitle>Insertion</SubTitle>
					<Text>To insert a node in an AVL tree, follow these steps:</Text>
					<List>
						<li>Insert like a normal BST insertion.</li>
						<li>Update the height of each ancestor node.</li>
						<li>Check the balance factor of each ancestor node.</li>
						<li>
							If the balance factor is out of range (-1, 0, 1), perform
							rotations to balance the tree.
						</li>
					</List>
					<Text>Example:</Text>
					<List>
						<li>
							<strong>Insert 14:</strong>
							{" As there is no-node so 14 will be root."}
							<br />
							<strong>Result:</strong>
							<br />
							<Image
								src="/assets/AVL/Insertion_Images/AVL_img_1.png"
								alt="Insert 14"
								onClick={() =>
									handleImageClick("/assets/AVL/Insertion_Images/AVL_img_1.png")
								}
							/>
						</li>
						<li>
							<strong>Insert 17:</strong>
							{
								" Here since 17 is greater so according to BST insertion it will be inserted at the right of 14."
							}
							<br />
							<strong>Result:</strong>
							<br />
							<Image
								src="/assets/AVL/Insertion_Images/AVL_img_2.png"
								alt="Insert 17"
								onClick={() =>
									handleImageClick("/assets/AVL/Insertion_Images/AVL_img_2.png")
								}
							/>
						</li>
						<li>
							<strong>Insert 11:</strong>
							{
								" According to BST insertion follow up..,11 will be inserted at left of 14."
							}
							<br />
							<strong>Result:</strong>
							<br />
							<Image
								src="/assets/AVL/Insertion_Images/AVL_img_3.png"
								alt="Insert 11"
								onClick={() =>
									handleImageClick("/assets/AVL/Insertion_Images/AVL_img_3.png")
								}
							/>
						</li>
						<li>
							<strong>Insert 7:</strong>
							{
								" On inserting 7 (By BST insertion follow up)., there will be no violation (so simply insert)."
							}
							<br />
							<strong>Result:</strong>
							<br />{" "}
							<Image
								src="/assets/AVL/Insertion_Images/AVL_img_4.png"
								alt="Insert 7"
								onClick={() =>
									handleImageClick("/assets/AVL/Insertion_Images/AVL_img_4.png")
								}
							/>
						</li>
						<li>
							<strong>Insert 53:</strong>
							{
								" On inserting 53., still there will be no violation. (So, simply insert)"
							}
							<br />
							<strong>Result:</strong>
							<br />
							<Image
								src="/assets/AVL/Insertion_Images/AVL_img_5.png"
								alt="Insert 53"
								onClick={() =>
									handleImageClick("/assets/AVL/Insertion_Images/AVL_img_5.png")
								}
							/>
						</li>
						<li>
							<strong>Insert 4:</strong>
							{
								" On inserting 4., there will be violation occurence at 11 (BF: 2)..,so here requires Right Rotation at 11."
							}
							<br />
							<strong>Result After (Right Rotation):</strong>
							<br />
							<Image
								src="/assets/AVL/Insertion_Images/AVL_img_6.png"
								alt="Insert 4"
								onClick={() =>
									handleImageClick("/assets/AVL/Insertion_Images/AVL_img_6.png")
								}
							/>
						</li>
						<li>
							<strong>Insert 13:</strong>
							{
								" On inserting 13 there will be no-violation. so, simply insert."
							}
							<br />
							<strong>Result:</strong>
							<br />
							<Image
								src="/assets/AVL/Insertion_Images/AVL_img_7.png"
								alt="Insert 13"
								onClick={() =>
									handleImageClick("/assets/AVL/Insertion_Images/AVL_img_7.png")
								}
							/>
						</li>
						<li>
							<strong>Insert 12: </strong>On inserting 12., Balance Factor of 11
							becomes -2..(Violation at 11).., so now here requires Right-Left
							Rotation.
							<br />
							<strong>Result After (Right-Left Rotation):</strong>
							<br />
							<Image
								src="/assets/AVL/Insertion_Images/AVL_img_8.png"
								alt="Insert 12"
								onClick={() =>
									handleImageClick("/assets/AVL/Insertion_Images/AVL_img_8.png")
								}
							/>
						</li>
						<li>
							<strong>Insert 8: </strong>On inserting 8.., BF of 7 becomes -2
							(violation at 7)., so requires., Right-Left Rotation + child
							exchange., where 11 becomes child of 7 and 12.., and 8 becomes
							child of 7.,
							<br />
							<strong>Result After (Rotation + child swapping):</strong>
							<br />
							<Image
								src="/assets/AVL/Insertion_Images/AVL_img_9.png"
								alt="Insert 8"
								onClick={() =>
									handleImageClick("/assets/AVL/Insertion_Images/AVL_img_9.png")
								}
							/>
						</li>
						<li>
							<strong>Insert 60: </strong>On inserting 60., BF of 17 becomes
							-2., so here requies., Left-Rotation. where 53 becomes parent of
							17 and 60.
							<br />
							<strong>Result After (Left Rotation):</strong>
							<br />
							<Image
								src="/assets/AVL/Insertion_Images/AVL_img_10.png"
								alt="Insert 60"
								onClick={() =>
									handleImageClick(
										"/assets/AVL/Insertion_Images/AVL_img_10.png",
									)
								}
							/>
						</li>
						<li>
							<strong>Insert 19: </strong>There will be No-Violation on
							inserting 19
							<br />
							<strong>Result:</strong>
							<br />
							<Image
								src="/assets/AVL/Insertion_Images/AVL_img_11.png"
								alt="Insert 19"
								onClick={() =>
									handleImageClick(
										"/assets/AVL/Insertion_Images/AVL_img_11.png",
									)
								}
							/>
						</li>
						<li>
							<strong>Insert 16: </strong> There wil be No-Violation on
							inserting 16.
							<br />
							<strong>Result:</strong>
							<br />
							<Image
								src="/assets/AVL/Insertion_Images/AVL_img_12.png"
								alt="Insert 16"
								onClick={() =>
									handleImageClick(
										"/assets/AVL/Insertion_Images/AVL_img_12.png",
									)
								}
							/>
						</li>
						<li>
							<strong>Insert 20: </strong>On inserting 20., the BF of 53 becomes
							2 (Violation)..,so here requires Left-Right Rotation & child
							exchange. where 19 becomes parent of 17 and 53.
							<br />
							<strong>
								Result After (Left-Right Rotation & Child Exchanging):
							</strong>
							<br />
							<Image
								src="/assets/AVL/Insertion_Images/AVL_img_13.png"
								alt="Insert 20"
								onClick={() =>
									handleImageClick(
										"/assets/AVL/Insertion_Images/AVL_img_13.png",
									)
								}
							/>
						</li>
					</List>
				</Section>

				<Section>
					<SubTitle>Deletion</SubTitle>
					<Text>To delete a node in an AVL tree, follow these steps:</Text>
					<List>
						<li>Delete the node as in a regular BST.</li>
						<li>Update the height of each ancestor node.</li>
						<li>Check the balance factor of each ancestor node.</li>
						<li>
							If the balance factor is out of range (-1, 0, 1), perform
							rotations to balance the tree.
						</li>
					</List>
					<Text>Example:</Text>
					<List>
						<div>
							<ImageContainer>
								<strong>Original tree before any deletion:</strong>
								<br />
								<Image
									src="/assets/AVL/Insertion_Images/AVL_img_13.png"
									alt="Delete 8"
									onClick={() =>
										handleImageClick(
											"/assets/AVL/Insertion_Images/AVL_img_13.png",
										)
									}
								/>
							</ImageContainer>
						</div>
						<li>
							<strong>Delete 8:</strong> Remove the node with value 8. Since it
							has no children, simply remove it.
							<br />
							<strong>Result:</strong>
							<br />
							<Image
								src="/assets/AVL/Deletion_Images/AVL_Del_1.png"
								alt="Delete 8"
								onClick={() =>
									handleImageClick("/assets/AVL/Deletion_Images/AVL_Del_1.png")
								}
							/>
						</li>
						<li>
							<strong>Delete 7:</strong> Remove the node with value 7. Since it
							has one child, replace it with its child.
							<br />
							<strong>Result:</strong>
							<br />
							<Image
								src="/assets/AVL/Deletion_Images/AVL_Del_2.png"
								alt="Delete 7"
								onClick={() =>
									handleImageClick("/assets/AVL/Deletion_Images/AVL_Del_2.png")
								}
							/>
						</li>
						<li>
							<strong>Delete 11:</strong> Remove the node with value 11. Since
							it has two children, replace it with its in-order successor (the
							smallest node in the right subtree).
							<br />
							<strong>Result:</strong>
							<br />
							<Image
								src="/assets/AVL/Deletion_Images/AVL_Del_3.png"
								alt="Delete 11"
								onClick={() =>
									handleImageClick("/assets/AVL/Deletion_Images/AVL_Del_3.png")
								}
							/>
						</li>
						<li>
							<strong>Delete 14:</strong> Remove the node with value 14(root).
							Since it has two child, replace its in-order successor (the
							smallest node in the right subtree) and delete the 14.
							<br />
							<strong>Result:</strong>
							<br />
							<Image
								src="/assets/AVL/Deletion_Images/AVL_Del_4.png"
								alt="Delete 14"
								onClick={() =>
									handleImageClick("/assets/AVL/Deletion_Images/AVL_Del_4.png")
								}
							/>
						</li>
						<li>
							<strong>Delete 17:</strong> Remove the node with value 17. Since
							it has no children, But due to this violation occurs at 19 (BF:
							-2)...So here requires Left Rotation. After which 53 becomes
							parent of 19 & 60 and also here 20 will become right child of 19.
							<br />
							<strong>Result After (Left Rotation):</strong>
							<br />
							<Image
								src="/assets/AVL/Deletion_Images/AVL_Del_5.png"
								alt="Delete 17"
								onClick={() =>
									handleImageClick("/assets/AVL/Deletion_Images/AVL_Del_5.png")
								}
							/>
						</li>
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
					<SubTitle>More References</SubTitle>
					<List>
						<li>
							<a
								href="https://en.wikipedia.org/wiki/AVL_tree"
								target="_blank"
								style={{
									color: colors.headline,
									textDecoration: 'underline',
									fontWeight: 500
								}}
							>
								Wikipedia: AVL Tree
							</a>
						</li>
						<li>
							<a
								href="https://www.geeksforgeeks.org/avl-tree-set-1-insertion/"
								target="_blank"
								style={{
									color: colors.headline,
									textDecoration: 'underline',
									fontWeight: 500
								}}
							>
								GeeksforGeeks: AVL Tree Insertion
							</a>
						</li>
						<li>
							<a
								href="https://www.programiz.com/dsa/avl-tree"
								target="_blank"
								style={{
									color: colors.headline,
									textDecoration: 'underline',
									fontWeight: 500
								}}
							>
								Programiz: AVL Tree
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

export default AVLConcept;
