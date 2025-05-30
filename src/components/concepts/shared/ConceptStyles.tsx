import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { colors } from '../../../styles/colors';

export const ConceptContainer = styled.div`
  min-height: 100vh;
  background: ${colors.background};
  padding: 40px 20px;
`;

export const ConceptContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: ${colors.surface};
  border: 2px solid ${colors.secondary};
  border-radius: 0;
  padding: 32px;
  box-shadow: 4px 4px 0 ${colors.secondary};
`;

export const ConceptHeader = styled.header`
  margin-bottom: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ConceptTitle = styled.h1`
  font-size: 36px;
  color: ${colors.headline};
  margin: 0;
  font-weight: 700;
`;

export const ConceptSection = styled.section`
  margin-bottom: 32px;
  border: 2px solid ${colors.secondary};
  padding: 20px;
  background: ${colors.background};
  box-shadow: 4px 4px 0 ${colors.secondary};
`;

export const SectionTitle = styled.h2`
  font-size: 24px;
  color: ${colors.headline};
  margin: 0 0 16px;
  font-weight: 600;
`;

export const ConceptText = styled.p`
  color: ${colors.headline};
  line-height: 1.6;
  margin: 0 0 16px;
  font-size: 16px;
`;

export const ConceptList = styled.ul`
  color: ${colors.headline};
  line-height: 1.6;
  margin: 0 0 24px;
  padding-left: 24px;

  li {
    margin-bottom: 8px;
  }
`;

export const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(0, 0, 0, 0.03);
  color: ${colors.headline};
  border: 2px solid ${colors.secondary};
  border-radius: 0;
  text-decoration: none;
  font-weight: 500;
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
`;

export const PrerequisiteLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.03);
  color: ${colors.headline};
  border: 2px solid ${colors.secondary};
  border-radius: 0;
  text-decoration: none;
  font-weight: 500;
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
`;

export const CodeBlock = styled.pre`
  background: ${colors.background};
  padding: 20px;
  border: 2px solid ${colors.secondary};
  border-radius: 0;
  overflow-x: auto;
  color: ${colors.headline};
  margin: 16px 0;
  box-shadow: 4px 4px 0 ${colors.secondary};
  font-family: "Courier New", Courier, monospace;
`;

export const Highlight = styled.span`
  color: ${colors.primary};
  font-weight: 500;
`;

export const ReferenceLink = styled.a`
  color: ${colors.headline};
  text-decoration: underline;
  font-weight: 500;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    opacity: 0.6;
  }
`; 