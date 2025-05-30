import React from "react";
import styled from "styled-components";
import { colors } from "../../styles/colors";

const Footer = styled.footer`
	text-align: center;
	padding: 20px;
	background: transparent;
	border-top: 1px solid ${colors.border};
	color: ${colors.headline};
	font-size: 16px;
`;

const StyledLink = styled.a`
	text-decoration: none;
	color: ${colors.headline};
	background: rgba(0, 0, 0, 0.03);
	padding: 4px 8px;
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
`;

const MadeWithLove: React.FC = () => {
	return (
		<Footer>
			Made with ❤️ by{" "}
			<StyledLink
				href="https://github.com/saidinesh49"
				target="_blank"
				rel="noopener noreferrer"
			>
				saidinesh49
			</StyledLink>
		</Footer>
	);
};

export default MadeWithLove;
