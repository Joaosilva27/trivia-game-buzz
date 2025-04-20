import React, { CSSProperties } from "react";

export const markdownStyles: Record<string, CSSProperties> = {
  h1: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "2rem",
    marginTop: "1rem",
    textAlign: "center",
    color: "#f3f4f6",
    textShadow: "0 2px 4px rgba(0,0,0,0.5)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    letterSpacing: "0.05em",
  },
  h2: {
    fontSize: "1.75rem",
    fontWeight: "bold",
    marginBottom: "1.5rem",
    marginTop: "1.5rem",
    color: "#93c5fd",
    textShadow: "0 1px 2px rgba(0,0,0,0.4)",
  },
  p: {
    marginBottom: "1.5rem",
    fontSize: "1.25rem",
    lineHeight: "1.6",
    color: "#e2e8f0",
  },
  ul: {
    paddingLeft: "2rem",
    marginBottom: "1.5rem",
    listStyleType: "disc",
  },
  ol: {
    paddingLeft: "0",
    marginBottom: "2rem",
    listStyleType: "none",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    width: "100%",
    maxWidth: "600px",
  },
  li: {
    marginBottom: "0",
    padding: "1rem 1.5rem",
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    borderRadius: "0.5rem",
    fontSize: "1.15rem",
    textAlign: "left",
    cursor: "pointer",
    transition: "all 0.2s ease",
    border: "1px solid rgba(148, 163, 184, 0.2)",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    position: "relative",
    paddingLeft: "3.5rem",
  },
};

export const handleAnswerHover = (event: React.MouseEvent<HTMLElement>) => {
  event.currentTarget.style.backgroundColor = "rgba(30, 41, 59, 0.8)";
  event.currentTarget.style.transform = "translateY(-2px)";
  event.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.3)";
};

export const handleAnswerLeave = (event: React.MouseEvent<HTMLElement>) => {
  event.currentTarget.style.backgroundColor = "rgba(15, 23, 42, 0.6)";
  event.currentTarget.style.transform = "translateY(0)";
  event.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
};

export const formatAnswerListItem = (text: string) => {
  const cleanText = text.replace(/\*/g, "");

  const match = cleanText.match(/^([A-D])\.\s/);

  if (match) {
    const letter = match[1];
    const answerText = cleanText.replace(/^[A-D]\.\s/, "");

    return (
      <>
        <span
          style={{
            position: "absolute",
            left: "1rem",
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor: "#6366f1",
            color: "white",
            width: "1.75rem",
            height: "1.75rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            fontWeight: "bold",
          }}
        >
          {letter}
        </span>
        {answerText}
      </>
    );
  }
  return cleanText;
};

export const isAnswerCorrect = (text: string) => {
  return text.includes("*");
};
