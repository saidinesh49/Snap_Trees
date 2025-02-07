import React from "react";
import styled from "styled-components";
import { colors } from "../../styles/colors";

const Footer = styled.footer`
	text-align: center;
	padding: 20px;
	background: transparent;
	border-top: 1px solid ${colors.border};
	color: ${colors.primary};
	font-size: 16px;
`;

const StyledLink = styled.a`
	text-decoration: underline;
	color: darkblue;
	transition: text-decoration-thickness 0.2s;

	&:hover {
		text-decoration-thickness: 2px;
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
