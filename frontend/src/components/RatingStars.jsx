

import React from "react";
import { StarIcon as SolidStar } from "@heroicons/react/24/solid";
import { StarIcon as OutlineStar } from "@heroicons/react/24/outline";

const RatingStars = ({ rating = 0, max = 5 }) => {
  const stars = [];

  for (let i = 1; i <= max; i++) {
    stars.push(
      i <= rating ? (
        <SolidStar key={i} className="w-5 h-5 text-yellow-400 inline-block" />
      ) : (
        <OutlineStar key={i} className="w-5 h-5 text-gray-300 inline-block" />
      )
    );
  }

  return <div className="flex items-center space-x-1">{stars}</div>;
};

export default RatingStars;
