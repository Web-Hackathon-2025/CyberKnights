import { Star } from 'lucide-react';

const RatingDisplay = ({ rating, reviews, size = 'md', showCount = true }) => {
  const sizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const iconSize = sizes[size] || sizes.md;
  const textSize = textSizes[size] || textSizes.md;

  // Round to 1 decimal place
  const displayRating = rating ? rating.toFixed(1) : 'N/A';

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${iconSize} ${
              star <= Math.round(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-neutral-200 text-neutral-200'
            }`}
          />
        ))}
      </div>
      <span className={`font-semibold text-neutral-900 ${textSize}`}>
        {displayRating}
      </span>
      {showCount && reviews !== undefined && (
        <span className={`text-neutral-500 ${textSize}`}>
          ({reviews})
        </span>
      )}
    </div>
  );
};

export default RatingDisplay;

