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
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 12px ${colors.shadow};
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
  background: ${colors.gradient.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export const ConceptSection = styled.section`
  margin-bottom: 32px;
`;

export const SectionTitle = styled.h2`
  font-size: 24px;
  color: ${colors.headline};
  margin: 0 0 16px;
  font-weight: 600;
`;

export const ConceptText = styled.p`
  color: ${colors.paragraph};
  line-height: 1.6;
  margin: 0 0 16px;
  font-size: 16px;
`;

export const ConceptList = styled.ul`
  color: ${colors.paragraph};
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
  background: ${colors.surfaceLight};
  color: ${colors.primary};
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    transform: translateX(-4px);
    background: ${colors.surface};
    box-shadow: 0 2px 8px ${colors.shadow};
  }

  svg {
    stroke: ${colors.primary};
  }
`;

export const CodeBlock = styled.pre`
  background: ${colors.surfaceLight};
  padding: 20px;
  border-radius: 8px;
  overflow-x: auto;
  border: 1px solid ${colors.border};
  color: ${colors.paragraph};
  margin: 16px 0;
`;

export const Highlight = styled.span`
  color: ${colors.primary};
  font-weight: 500;
`; 