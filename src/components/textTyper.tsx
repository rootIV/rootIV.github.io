import { useState, useEffect } from "react";
import "../styles/login.scss";

interface TextTyperProps {
  text: string;
  speed?: number;
  pause?: number;
}

export default function TextTyper({
  text,
  speed = 150,
  pause = 2500,
}: TextTyperProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let timeout: number;

    if (!isDeleting && index <= text.length) {
      setDisplayedText(text.slice(0, index));
      timeout = window.setTimeout(() => setIndex(index + 1), speed);
    } else if (isDeleting && index >= 0) {
      setDisplayedText(text.slice(0, index));
      timeout = window.setTimeout(() => setIndex(index - 1), speed);
    } else if (!isDeleting && index > text.length) {
      timeout = window.setTimeout(() => setIsDeleting(true), pause);
    } else if (isDeleting && index < 0) {
      setIsDeleting(false);
      setIndex(0);
    }

    return () => clearTimeout(timeout);
  }, [index, isDeleting, text, speed, pause]);

  return (
    <h1 className="typewriter">
      {displayedText}
      <span className="cursor">|</span>
    </h1>
  );
}
