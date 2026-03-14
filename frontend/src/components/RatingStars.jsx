import React, { useState } from "react";
import { StarIcon as SolidStar } from "@heroicons/react/24/solid";
import { StarIcon as OutlineStar } from "@heroicons/react/24/outline";

const RatingStars = ({ rating = 0, max = 5, editable = false, setRating }) => {
  const [hovered, setHovered] = useState(0);

  const stars = [];
  for (let i = 1; i <= max; i++) {
    const filled = i <= (hovered || rating);
    stars.push(
      <button
        key={i}
        type="button"
        disabled={!editable}
        onClick={() => editable && setRating?.(i)}
        onMouseEnter={() => editable && setHovered(i)}
        onMouseLeave={() => editable && setHovered(0)}
        className={`${editable ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"} p-0 bg-transparent border-none`}
      >
        {filled ? (
          <SolidStar className="w-5 h-5 text-yellow-400" />
        ) : (
          <OutlineStar className="w-5 h-5 text-gray-300" />
        )}
      </button>
    );
  }

  return <div className="flex items-center space-x-0.5">{stars}</div>;
};

export default RatingStars;