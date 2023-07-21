import React, { useEffect, useState, useRef } from "react";

export default function CardContainer({ children, cardWidth }) {
  // Ref to get the width of the container element
  const containerRef = useRef(null);

  // Calculate the number of cards to be shown based on container width
  const [cardAmount, setCardAmount] = useState(5);
  const minGap = 30; // Minimum gap between cards

  useEffect(() => {
    // Update the number of cards to be shown based on the container width.
    const updateCardAmount = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const maxAmount = Math.floor(
          (containerWidth + minGap) / (cardWidth + minGap)
        );
        // Limit the cardAmount to a maximum of 15
        setCardAmount(Math.min(maxAmount, 15));
      }
    };

    // Update the number of cards to be shown on initial render and window resize
    updateCardAmount();
    window.addEventListener("resize", updateCardAmount);
    return () => window.removeEventListener("resize", updateCardAmount);
  }, []);

  return (
    <div className="track-cards" ref={containerRef}>
      {React.Children.map(children, (child, index) => {
        // Show only the first cardAmount children
        if (index < cardAmount) {
          return child;
        }
        return null;
      })}
    </div>
  );
}
