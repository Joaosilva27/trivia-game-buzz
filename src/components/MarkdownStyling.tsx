import React from "react";

// Define CSS style types
type CSSProperties = React.CSSProperties;

// Export styles as objects with proper TypeScript types
export const markdownStyles: Record<string, CSSProperties> = {
  h1: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "1rem",
    marginTop: "0.5rem",
    textAlign: "center",
    color: "#ffffff",
    textShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)",
    fontFamily: '"Poppins", sans-serif',
    letterSpacing: "0.05rem",
  },
  h2: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "0.75rem",
    marginTop: "1rem",
    color: "#f59e0b",
  },
  p: {
    fontSize: "1.125rem",
    lineHeight: "1.6",
    marginBottom: "1rem",
    color: "#e2e8f0",
  },
  ul: {
    paddingLeft: "1.25rem",
    marginBottom: "1rem",
    listStyleType: "none",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    width: "100%",
    maxWidth: "100%",
  },
  ol: {
    paddingLeft: "1.25rem",
    marginBottom: "1rem",
    listStyleType: "none",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    width: "100%",
    maxWidth: "100%",
  },
  li: {
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    marginBottom: "0.5rem",
    padding: "0.75rem 1rem",
    borderRadius: "0.5rem",
    fontSize: "1.125rem",
    textAlign: "left",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    position: "relative",
    paddingLeft: "2.5rem",
  },
};

// Helper functions with proper type annotations
export const handleAnswerHover = (event: React.MouseEvent<HTMLLIElement>): void => {
  const target = event.currentTarget;
  target.style.backgroundColor = "rgba(59, 130, 246, 0.2)";
  target.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.2)";
  target.style.transform = "translateY(-2px)";
};

export const handleAnswerLeave = (event: React.MouseEvent<HTMLLIElement>): void => {
  const target = event.currentTarget;
  target.style.backgroundColor = "rgba(15, 23, 42, 0.6)";
  target.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
  target.style.transform = "translateY(0)";
};

export const formatAnswerListItem = (text: string): React.ReactNode => {
  // Check if the text starts with a letter followed by a period and space
  const isCorrect = isAnswerCorrect(text);
  const match = text.match(/^([A-D])\.?\s(.+)$/);

  if (match) {
    const [, letter, content] = match;
    return (
      <>
        <span
          style={{
            backgroundColor: "rgba(59, 130, 246, 0.3)",
            borderRadius: "50%",
            width: "1.5rem",
            height: "1.5rem",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: "0.75rem",
            position: "absolute",
            left: "0.75rem",
            top: "50%",
            transform: "translateY(-50%)",
            fontWeight: "bold",
            color: "white",
          }}
        >
          {letter}
        </span>
        {content}
      </>
    );
  }

  return text;
};

export const isAnswerCorrect = (text: string): boolean => {
  // Check if the answer text contains "✓" or "correct" case insensitive
  const lowerText = text.toLowerCase();
  return lowerText.includes("✓") || lowerText.includes("correct");
};
