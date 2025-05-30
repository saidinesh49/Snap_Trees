import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { TreeVisualization } from "./components/TreeVisualization";
import { BinarySearchTree } from "./trees/BinarySearchTree";
import { TreeData, AnimationStep } from "./types";
import { TreeTypeSwitcher } from "./components/TreeTypeSwitcher";
import { AVLVisualization } from "./components/AVLVisualization";
import { AVLTree } from "./trees/AVLTree";
import { TreeType } from "./components/TreeTypeSwitcher";
import { BaseTree } from "./types";
import { BTreeVisualization } from "./components/BTreeVisualization";
import { BTree } from "./trees/BTree";
import { BTreeData } from "./types/BTreeTypes";
import { Concepts } from "./components/concepts/Concepts";
import BSTConcept from "./components/concepts/BSTConcept";
import AVLConcept from "./components/concepts/AVLConcept";
import { BTreeConcept } from "./components/concepts/BTreeConcept";
import { RedBlackTree } from "./trees/RedBlackTree";
import { RedBlackVisualization } from "./components/RedBlackVisualization";
import { RBNode } from "./types/RedBlackTypes";
import RedBlackConcept from "./components/concepts/RedBlackConcept";
import BinaryTreeConcept from "./components/concepts/BinaryTreeConcept";
import { colors } from "./styles/colors";

const AppContainer = styled.div`
	display: flex;
	flex-direction: column;
	height: 100vh;
	padding: 20px;
	gap: 20px;
	background: ${colors.background};
	color: ${colors.paragraph};
`;

const Header = styled.header`
	padding: 20px;
	background: ${colors.surface};
	border-radius: 12px;
	box-shadow: 0 2px 4px ${colors.shadow};
	display: flex;
	justify-content: space-between;
	align-items: center;

	@media (max-width: 768px) {
		flex-direction: column;
		gap: 16px;
		padding: 16px;
	}
`;

const HeaderControls = styled.div`
	display: flex;
	gap: 32px;
	align-items: center;
	margin-left: auto;
	padding-right: 16px;

	@media (max-width: 768px) {
		flex-direction: column;
		width: 100%;
		gap: 16px;
		padding-right: 0;
	}
`;

const SelectContainer = styled.div`
	display: flex;
	gap: 16px;
	align-items: center;

	select {
		padding: 8px 12px;
		border: 2px solid ${colors.secondary};
		border-radius: 0;
		font-size: 14px;
		min-width: 150px;
		background: ${colors.background};
		color: ${colors.headline};
		cursor: pointer;
		transition: all 0.2s;
		box-shadow: 4px 4px 0 ${colors.secondary};

		&:hover {
			box-shadow: 2px 2px 0 ${colors.secondary};
		}

		&:focus {
			outline: none;
			box-shadow: 2px 2px 0 ${colors.secondary};
		}

		&:active {
			box-shadow: none;
			transform: translate(4px, 4px);
		}
	}

	label {
		color: ${colors.headline};
		font-weight: 600;
	}

	@media (max-width: 768px) {
		width: 100%;
		flex-wrap: wrap;
		justify-content: center;

		select {
			width: 100%;
			padding: 12px;
			font-size: 16px;
		}
	}
`;

const Title = styled.h1`
	margin: 0;
	font-size: 24px;
	color: ${colors.headline};
`;

const ConceptLink = styled(Link)`
	color: ${colors.headline};
	background: rgba(0, 0, 0, 0.03);
	text-decoration: none;
	display: flex;
	align-items: center;
	gap: 8px;
	font-size: 14px;
	font-weight: 500;
	padding: 8px 16px;
	border: 2px solid ${colors.secondary};
	border-radius: 0;
	transition: all 0.2s;
	box-shadow: 4px 4px 0 ${colors.secondary};

	&:hover {
		background: rgba(0, 0, 0, 0.05);
		box-shadow: 2px 2px 0 ${colors.secondary};
		transform: translate(2px, 2px);
	}

	&:active {
		background: rgba(0, 0, 0, 0.08);
		box-shadow: none;
		transform: translate(4px, 4px);
	}

	svg {
		stroke: ${colors.headline};
	}

	@media (max-width: 768px) {
		width: 100%;
		justify-content: center;
		padding: 12px;
		font-size: 16px;
	}
`;

const ControlPanel = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 16px;
	padding: 20px;
	background: ${colors.background};
	border: 2px solid ${colors.secondary};
	border-radius: 0;
	box-shadow: 4px 4px 0 ${colors.secondary};

	@media (max-width: 768px) {
		flex-direction: column;
		gap: 12px;
		padding: 16px;
	}
`;

const ControlGroup = styled.div`
	display: flex;
	gap: 8px;
	align-items: center;

	@media (max-width: 768px) {
		flex-direction: column;
		width: 100%;
		gap: 12px;
	}
`;

const Input = styled.input`
	padding: 8px 12px;
	border: 2px solid ${colors.secondary};
	border-radius: 0;
	font-size: 14px;
	width: 200px;
	transition: all 0.2s;
	background: ${colors.background};
	color: ${colors.headline};
	box-shadow: 4px 4px 0 ${colors.secondary};

	&:focus {
		outline: none;
		box-shadow: 2px 2px 0 ${colors.secondary};
	}

	&:hover {
		box-shadow: 2px 2px 0 ${colors.secondary};
	}

	&:active {
		box-shadow: none;
		transform: translate(4px, 4px);
	}

	@media (max-width: 768px) {
		width: 100%;
		font-size: 16px;
		padding: 12px;
	}
`;

interface ButtonProps {
	variant?: "danger" | "secondary" | "success";
	disabled?: boolean;
	active?: boolean;
}

const Button = styled.button<ButtonProps>`
	padding: 8px 16px;
	border: 2px solid ${colors.secondary};
	border-radius: 0;
	font-size: 14px;
	font-weight: 600;
	cursor: pointer;
	background: ${({ variant, disabled, active }: ButtonProps) => {
		if (disabled) return colors.secondaryMuted;
		if (active) return colors.surfaceLight;
		
		switch (variant) {
			case "danger":
				return "rgba(255, 0, 0, 0.1)"; // Subtle red for delete
			case "success":
				return "rgba(0, 128, 0, 0.1)"; // Subtle green for search
			case "secondary":
				return "rgba(0, 0, 0, 0.05)"; // Very subtle black for undo/redo
			default:
				return "rgba(255, 255, 0, 0.1)"; // Subtle yellow for insert
		}
	}};
	color: ${({ variant, disabled }: ButtonProps) => {
		if (disabled) return colors.textMuted;
		
		switch (variant) {
			case "danger":
				return "#cc0000"; // Darker red for delete
			case "success":
				return "#006400"; // Darker green for search
			case "secondary":
				return colors.headline; // Black for undo/redo
			default:
				return colors.headline; // Black for insert
		}
	}};
	transition: all 0.2s;
	display: flex;
	align-items: center;
	gap: 8px;
	box-shadow: 4px 4px 0 ${colors.secondary};

	&:hover {
		background: ${({ variant, disabled }: ButtonProps) => {
			if (disabled) return colors.secondaryMuted;
			
			switch (variant) {
				case "danger":
					return "rgba(255, 0, 0, 0.15)"; // Slightly more red
				case "success":
					return "rgba(0, 128, 0, 0.15)"; // Slightly more green
				case "secondary":
					return "rgba(0, 0, 0, 0.08)"; // Slightly more black
				default:
					return "rgba(255, 255, 0, 0.15)"; // Slightly more yellow
			}
		}};
		box-shadow: 2px 2px 0 ${colors.secondary};
	}

	&:active {
		box-shadow: none;
		transform: translate(4px, 4px);
	}

	&:disabled {
		background: ${colors.secondaryMuted};
		border-color: ${colors.secondaryMuted};
		color: ${colors.textMuted};
		cursor: not-allowed;
		box-shadow: none;
	}

	@media (max-width: 768px) {
		width: 100%;
		justify-content: center;
		padding: 12px;
		font-size: 16px;
	}
`;

const Divider = styled.div`
	width: 1px;
	height: 24px;
	background: #dee2e6;
	margin: 0 8px;

	@media (max-width: 768px) {
		width: 100%;
		height: 1px;
		margin: 8px 0;
	}
`;

const VisualizationContainer = styled.div`
	flex: 1;
	background: ${colors.surfaceLight};
	border-radius: 12px;
	box-shadow: 0 2px 8px ${colors.shadow};
	overflow: hidden;
	position: relative;
	min-height: 500px;
	border: 1px solid ${colors.borderLight};

	@media (max-width: 768px) {
		min-height: 400px;
		height: calc(100vh - 300px);
		margin: 0 -16px;
		border-radius: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	svg {
		width: 100%;
		height: 100%;

		@media (max-width: 768px) {
			transform-origin: center center;
			transform: scale(0.8);
		}
	}

	/* Add transition for smooth clearing */
	transition: all 0.3s ease-out;
`;

interface TreeState {
	tree: BaseTree;
	data: TreeData | BTreeData;
	animations: AnimationStep[];
}

const MainApp: React.FC = () => {
	const [inputValue, setInputValue] = useState("");
	const [history, setHistory] = useState<TreeState[]>([
		{
			tree: new BinarySearchTree(),
			data: new BinarySearchTree().getTreeData(),
			animations: [],
		},
	]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [searchResult, setSearchResult] = useState<number | null>(null);
	const [treeType, setTreeType] = useState<TreeType>("BST");
	const [btreeDegree, setBtreeDegree] = useState(3);
	const [popupMessage, setPopupMessage] = useState<string | null>(null);

	const currentTree = history[currentIndex].tree;
	const currentData = history[currentIndex].data;

	const addToHistory = (newTree: TreeState) => {
		const newHistory = history.slice(0, currentIndex + 1);
		newHistory.push(newTree);
		setHistory(newHistory);
		setCurrentIndex(currentIndex + 1);
	};

	const handleInsert = (e?: React.MouseEvent) => {
		e?.stopPropagation();
		const value = parseInt(inputValue);
		if (isNaN(value)) return;

		const newTree = currentTree.clone();
		newTree.insert(value);
		addToHistory({
			tree: newTree,
			data: newTree.getTreeData(),
			animations: [],
		});
		setInputValue("");
		setSearchResult(null);
	};

	const handleDelete = async (e?: React.MouseEvent) => {
		e?.stopPropagation();
		const value = parseInt(inputValue);
		if (isNaN(value)) return;

		const newTree = currentTree.clone();
		const animations = newTree.delete(value);

		addToHistory({
			tree: currentTree.clone(),
			data: currentTree.getTreeData(),
			animations,
		});

		setTimeout(() => {
			addToHistory({
				tree: newTree,
				data: newTree.getTreeData(),
				animations: [],
			});
		}, animations.length * 800);

		setInputValue("");
		setSearchResult(null);
	};

	const handleSearch = (e?: React.MouseEvent) => {
		e?.stopPropagation();
		const value = parseInt(inputValue);
		if (isNaN(value)) return;

		const animations = currentTree.search(value);
		setSearchResult(value);
		setInputValue("");

		const isFound = animations.some((anim) => anim.type === "found");
		if (isFound) {
			setPopupMessage(`Found ${value}!`);
		} else {
			setPopupMessage(`${value} not found in tree`);
		}

		setTimeout(() => {
			setPopupMessage(null);
		}, 2000);

		addToHistory({
			tree: currentTree.clone(),
			data: currentTree.getTreeData(),
			animations,
		});
	};

	const handleClear = () => {
		const newTree =
			treeType === "AVL"
				? new AVLTree()
				: treeType === "BTree"
				? new BTree(btreeDegree)
				: treeType === "RedBlack"
				? new RedBlackTree()
				: new BinarySearchTree();

		const animations = currentTree.clear();

		addToHistory({
			tree: currentTree.clone(),
			data: currentTree.getTreeData(),
			animations,
		});

		setTimeout(() => {
			addToHistory({
				tree: newTree,
				data: newTree.getTreeData(),
				animations: [],
			});
		}, animations.length * 800);

		setSearchResult(null);
	};

	const handleUndo = () => {
		if (currentIndex > 0) {
			setCurrentIndex(currentIndex - 1);
			setSearchResult(null);
		}
	};

	const handleRedo = () => {
		if (currentIndex < history.length - 1) {
			setCurrentIndex(currentIndex + 1);
			setSearchResult(null);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.stopPropagation();
		const value = e.target.value;
		if (value === "" || /^-?\d+$/.test(value)) {
			setInputValue(value);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleInsert();
		}
	};

	const handleTreeTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newType = e.target.value as TreeType;
		const newTree =
			newType === "AVL"
				? new AVLTree()
				: newType === "BTree"
				? new BTree(btreeDegree)
				: newType === "RedBlack"
				? new RedBlackTree()
				: new BinarySearchTree();

		setTreeType(newType);
		setHistory([
			{
				tree: newTree,
				data: newTree.getTreeData(),
				animations: [],
			},
		]);
		setCurrentIndex(0);
		setSearchResult(null);
		setInputValue("");
	};

	const isBTreeData = (data: TreeData | BTreeData): data is BTreeData => {
		return "keys" in (data.nodes[0] || {});
	};

	const convertToBTreeData = (data: TreeData | BTreeData): BTreeData => {
		if (treeType !== "BTree") return { nodes: [], links: [] };

		const tree = history[currentIndex].tree;
		if (tree instanceof BTree) {
			return tree.getBTreeData();
		}

		return { nodes: [], links: [] };
	};

	const resetTreeStates = () => {
		const newTree = currentTree.clone();
		if (treeType === "BTree" && newTree instanceof BTree) {
			const btreeData = newTree.getBTreeData();
			btreeData.nodes.forEach((node) => {
				node.state = "default";
				node.foundKey = undefined;
			});

			addToHistory({
				tree: newTree,
				data: newTree.getTreeData(),
				animations: [],
			});
		}
		setSearchResult(null);
	};

	useEffect(() => {
		const handleDocumentClick = () => {
			resetTreeStates();
		};

		document.addEventListener("click", handleDocumentClick);

		return () => {
			document.removeEventListener("click", handleDocumentClick);
		};
	}, [currentTree, treeType]);

	return (
		<AppContainer onClick={(e: React.MouseEvent) => e.stopPropagation()}>
			<Header>
				<Title>Tree Visualization</Title>
				<HeaderControls>
					<SelectContainer>
						<label>Select Tree Type:</label>
						<select value={treeType} onChange={handleTreeTypeChange}>
							<option value="BST">Binary Search Tree</option>
							<option value="AVL">AVL Tree</option>
							<option value="RedBlack">Red-Black Tree</option>
							<option value="BTree">B-Tree</option>
						</select>

						{treeType === "BTree" && (
							<>
								<label>Degree:</label>
								<select
									value={btreeDegree}
									onChange={(e) => {
										const newDegree = parseInt(e.target.value);
										setBtreeDegree(newDegree);
										const newTree = new BTree(newDegree);
										setHistory([
											{
												tree: newTree,
												data: newTree.getTreeData(),
												animations: [],
											},
										]);
										setCurrentIndex(0);
										setSearchResult(null);
										setInputValue("");
									}}
								>
									{[3, 4, 5, 6, 7].map((degree) => (
										<option key={degree} value={degree}>
											{degree}
										</option>
									))}
								</select>
							</>
						)}
					</SelectContainer>
					<ConceptLink to="/concept">
						Explore Concepts
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
					</ConceptLink>
				</HeaderControls>
			</Header>

			<ControlPanel>
				<ControlGroup>
					<Input
						type="text"
						value={inputValue}
						onChange={handleInputChange}
						onKeyPress={(e: React.KeyboardEvent) => {
							e.stopPropagation();
							if (e.key === "Enter") {
								handleInsert();
							}
						}}
						placeholder="Enter a number"
						onClick={(e: React.MouseEvent) => e.stopPropagation()}
					/>
					<Button onClick={(e: React.MouseEvent) => handleInsert(e)}>
						Insert
					</Button>
					<Button
						variant="danger"
						onClick={(e: React.MouseEvent) => handleDelete(e)}
						disabled={!inputValue}
					>
						Delete
					</Button>
					<Button
						variant="success"
						onClick={(e: React.MouseEvent) => handleSearch(e)}
						disabled={!inputValue}
					>
						Search
					</Button>
				</ControlGroup>

				<Divider />

				<ControlGroup>
					<Button
						variant="secondary"
						onClick={handleUndo}
						disabled={currentIndex === 0}
					>
						Undo
					</Button>
					<Button
						variant="secondary"
						onClick={handleRedo}
						disabled={currentIndex === history.length - 1}
					>
						Redo
					</Button>
					<Button
						variant="danger"
						onClick={handleClear}
						disabled={!currentData.nodes.length}
					>
						Clear
					</Button>
				</ControlGroup>
			</ControlPanel>

			<VisualizationContainer>
				{treeType === "RedBlack" ? (
					<RedBlackVisualization
						data={
							currentTree instanceof RedBlackTree
								? (currentTree as RedBlackTree).getRBTreeData()
								: { nodes: [], links: [] }
						}
						animations={history[currentIndex].animations}
						animationSpeed={800}
						onReset={resetTreeStates}
					/>
				) : treeType === "BTree" ? (
					<BTreeVisualization
						data={
							isBTreeData(currentData)
								? currentData
								: convertToBTreeData(currentData)
						}
						animations={history[currentIndex].animations}
						animationSpeed={800}
						onReset={resetTreeStates}
					/>
				) : treeType === "AVL" ? (
					<AVLVisualization
						data={currentData as TreeData}
						animations={history[currentIndex].animations}
						animationSpeed={800}
					/>
				) : (
					<TreeVisualization
						data={currentData as TreeData}
						animations={history[currentIndex].animations}
						animationSpeed={1000}
					/>
				)}
			</VisualizationContainer>

			{popupMessage && <PopupMessage>{popupMessage}</PopupMessage>}
		</AppContainer>
	);
};

const PopupMessage = styled.div`
	position: fixed;
	top: 20px;
	left: 50%;
	transform: translateX(-50%);
	background-color: #333;
	color: white;
	padding: 10px 20px;
	border-radius: 5px;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
	z-index: 1000;
	animation: fadeIn 0.3s ease-in;

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translate(-50%, -20px);
		}
		to {
			opacity: 1;
			transform: translate(-50%, 0);
		}
	}
`;

const App: React.FC = () => {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<MainApp />} />
				<Route path="/concept" element={<Concepts />} />
				<Route path="/concept/BST" element={<BSTConcept />} />
				<Route path="/concept/AVL" element={<AVLConcept />} />
				<Route path="/concept/RedBlack" element={<RedBlackConcept />} />
				<Route path="/concept/BTree" element={<BTreeConcept />} />
				<Route path="/concept/BinaryTree" element={<BinaryTreeConcept />} />
			</Routes>
		</Router>
	);
};

export default App;
