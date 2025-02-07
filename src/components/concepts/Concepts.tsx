import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { colors } from "../../styles/colors";
import MadeWithLove from "components/common/MadeWithLove";

const Container = styled.div`
	padding: 40px;
	max-width: 1200px;
	margin: 0 auto;
	background: ${colors.background};
	min-height: 100vh;
`;

const Header = styled.header`
	margin-bottom: 40px;
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const Title = styled.h1`
	font-size: 36px;
	color: ${colors.headline};
	margin: 0;
	font-weight: 700;
`;

const ConceptGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	gap: 24px;
`;

const ConceptCard = styled(Link)`
	padding: 28px;
	border-radius: 12px;
	background: ${colors.surface};
	box-shadow: 0 2px 8px ${colors.shadow};
	text-decoration: none;
	color: inherit;
	transition: all 0.2s;
	border: 1px solid ${colors.borderLight};

	&:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px ${colors.shadowHover};
		border-color: ${colors.primary};
	}
`;

const ConceptTitle = styled.h2`
	font-size: 24px;
	margin: 0 0 12px;
	color: ${colors.headline};
	font-weight: 600;
`;

const ConceptDescription = styled.p`
	margin: 0 0 20px;
	color: ${colors.paragraph};
	line-height: 1.6;
`;

const LearnMore = styled.span`
	color: ${colors.primary};
	display: flex;
	align-items: center;
	gap: 6px;
	font-weight: 500;
	font-size: 14px;

	svg {
		transition: transform 0.2s;
	}

	${ConceptCard}:hover & svg {
		transform: translateX(4px);
	}
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

const ExploreButton = styled(Link)`
	display: inline-block;
	padding: 12px 24px;
	margin-top: 20px;
	font-size: 16px;
	font-weight: 600;
	color: white;
	background-color: ${colors.primary};
	border-radius: 8px;
	text-decoration: none;
	transition: background-color 0.3s, transform 0.3s;

	&:hover {
		background-color: ${colors.primaryHover};
		transform: translateY(-2px);
		box-shadow: 0 4px 12px ${colors.shadowHover};
	}
`;

export const Concepts: React.FC = () => {
	return (
		<Container>
			<Header>
				<Title>Tree Data Structures</Title>
				<BackLink to="/">
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
					Back to Visualization
				</BackLink>
			</Header>

			<ConceptGrid>
				<ConceptCard to="/concept/BST">
					<ConceptTitle>Binary Search Tree</ConceptTitle>
					<ConceptDescription>
						A binary tree with the property that the key in each node is greater
						than all keys in its left subtree and less than all keys in its
						right subtree.
					</ConceptDescription>
					<LearnMore>
						Learn More
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
					</LearnMore>
				</ConceptCard>

				<ConceptCard to="/concept/AVL">
					<ConceptTitle>AVL Tree</ConceptTitle>
					<ConceptDescription>
						A self-balancing binary search tree where the heights of the two
						child subtrees of any node differ by at most one.
					</ConceptDescription>
					<LearnMore>
						Learn More
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
					</LearnMore>
				</ConceptCard>

				<ConceptCard to="/concept/RedBlack">
					<ConceptTitle>Red-Black Tree</ConceptTitle>
					<ConceptDescription>
						A self-balancing binary search tree with one extra bit per node for
						color, ensuring the tree remains balanced during operations.
					</ConceptDescription>
					<LearnMore>
						Learn More
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
					</LearnMore>
				</ConceptCard>

				<ConceptCard to="/concept/BTree">
					<ConceptTitle>B-Tree</ConceptTitle>
					<ConceptDescription>
						A self-balancing tree data structure that maintains sorted data and
						allows searches, sequential access, insertions, and deletions in
						logarithmic time.
					</ConceptDescription>
					<LearnMore>
						Learn More
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
					</LearnMore>
				</ConceptCard>
				<MadeWithLove />
			</ConceptGrid>
		</Container>
	);
};

export default Concepts;
