import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { colors } from "../../styles/colors";
import MadeWithLove from "components/common/MadeWithLove";
import { BackButton, PrerequisiteLink as SharedPrerequisiteLink, ReferenceLink as SharedReferenceLink } from "./shared/ConceptStyles";

// Reuse styled components from previous concepts
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

const PrerequisiteLink = styled(SharedPrerequisiteLink)``;

export const BTreeConcept: React.FC = () => {
	return (
		<Container>
			<Header>
				<Title>B-Tree</Title>
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
					<SubTitle>What is a B-Tree?</SubTitle>
					<Text>
						A B-tree is a self-balancing tree data structure that maintains
						sorted data and allows searches, sequential access, insertions, and
						deletions in logarithmic time. It's optimized for systems that read
						and write large blocks of data.
					</Text>
					<Text>
						Unlike binary trees, a B-tree node can have more than two children,
						making it efficient for storage systems like databases and file
						systems.
					</Text>
					<Text>
						For more information, refer to this{" "}
						<a
							href="https://en.wikipedia.org/wiki/B-tree"
							target="_blank"
							rel="noopener noreferrer"
							style={{
								color: colors.headline,
								textDecoration: 'underline',
								fontWeight: 500
							}}
						>
							Wikipedia article
						</a>
						.
					</Text>
				</Section>

				<Section>
					<SubTitle>Properties</SubTitle>
					<Text>For a B-tree of order m:</Text>
					<List>
						<li>Every node has at most m children</li>
						<li>
							Every non-leaf node (except root) has at least ⌈m/2⌉ children
						</li>
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

					<Text>
						<strong>1. Search</strong>
					</Text>
					<List>
						<li>Start from root</li>
						<li>Use binary search within node's keys</li>
						<li>Follow appropriate child pointer</li>
						<li>Repeat until key is found or leaf is reached</li>
					</List>

					<Text>
						<strong>2. Insertion</strong>
					</Text>
					<List>
						<li>Find appropriate leaf node</li>
						<li>If node has space, insert key</li>
						<li>If node is full, split node:</li>
						<li>- Move median key to parent</li>
						<li>- Create new node with right half</li>
						<li>Split may propagate up to root</li>
					</List>

					<Text>
						<strong>3. Deletion</strong>
					</Text>
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
						All operations are guaranteed to be logarithmic because the tree
						remains balanced through splits and merges.
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
					<Text>
						<strong>B-Tree vs Binary Search Tree:</strong>
					</Text>
					<List>
						<li>
							B-Tree has more children per node, leading to shallower trees
						</li>
						<li>
							B-Tree is better for disk access due to fewer I/O operations
						</li>
						<li>B-Tree is always balanced, ensuring logarithmic operations</li>
					</List>

					<Text>
						<strong>B-Tree vs AVL Tree:</strong>
					</Text>
					<List>
						<li>B-Tree has more keys per node, reducing tree height</li>
						<li>
							B-Tree has less frequent rebalancing, leading to fewer rotations
						</li>
						<li>
							B-Tree is better for external storage due to fewer disk accesses
						</li>
					</List>
				</Section>

				<Section>
					<SubTitle>More References</SubTitle>
					<List>
						<li>
							<a
								href="https://en.wikipedia.org/wiki/B-tree"
								target="_blank"
								rel="noopener noreferrer"
								style={{
									color: colors.headline,
									textDecoration: 'underline',
									fontWeight: 500
								}}
							>
								Wikipedia: B-Tree
							</a>
						</li>
						<li>
							<a
								href="https://www.geeksforgeeks.org/b-tree-set-1-introduction-2/"
								target="_blank"
								rel="noopener noreferrer"
								style={{
									color: colors.headline,
									textDecoration: 'underline',
									fontWeight: 500
								}}
							>
								GeeksforGeeks: B-Tree
							</a>
						</li>
						<li>
							<a
								href="https://www.tutorialspoint.com/data_structures_algorithms/b_trees.htm"
								target="_blank"
								rel="noopener noreferrer"
								style={{
									color: colors.headline,
									textDecoration: 'underline',
									fontWeight: 500
								}}
							>
								TutorialsPoint: B-Tree
							</a>
						</li>
					</List>
				</Section>
			</Content>
			<MadeWithLove />
		</Container>
	);
};

export default BTreeConcept;
