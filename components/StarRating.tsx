import Icon from "@expo/vector-icons/FontAwesome";
import { Box } from "./Box";
import { useEffect, useState } from "react";

export type StarRatingProps = {
  rating?: number;
  color?: string;
  size?: number;
};

type StarRatingModel = {
  icon: any;
  color?: string;
};

function useStarRating(props: StarRatingProps) {
  const [stars, setStars] = useState<StarRatingModel[]>([]);

  function calcStars(rating = 0, color?: string): StarRatingModel[] {
    const value = rating / 2;
    const integers = Math.floor(value);
    const hasHalf = value % 1 !== 0;
    const hasEmpty = 5 - integers - (hasHalf ? 1 : 0);

    const result: StarRatingModel[] = [
      ...Array(integers).fill({ icon: "star", color }),
      ...(hasHalf ? [{ icon: "star-half-full", color }] : []),
      ...Array(hasEmpty).fill({ icon: "star-o", color }),
    ];
    return result;
  }

  useEffect(() => {
    setStars(calcStars(props.rating, props.color));
  }, [props.rating, props.color]);

  return { stars };
}

export function StarRating({
  rating = 0,
  color = "#f1c40f",
  ...props
}: StarRatingProps) {
  const { stars } = useStarRating({ rating, ...props });
  return (
    <Box flexDirection="row">
      {stars.map((star, index) => (
        <Icon key={index} name={star.icon} color={color} size={props.size} />
      ))}
    </Box>
  );
}
