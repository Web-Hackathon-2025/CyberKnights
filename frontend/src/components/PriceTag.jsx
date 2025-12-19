const PriceTag = ({ price, priceType = 'fixed', size = 'md', className = '' }) => {
  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const textSize = sizes[size] || sizes.md;

  const formatPrice = () => {
    if (price === undefined || price === null) {
      return 'Price not set';
    }

    const formattedPrice = `PKR ${price.toLocaleString()}`;

    switch (priceType) {
      case 'hourly':
        return `${formattedPrice}/hr`;
      case 'negotiable':
        return `${formattedPrice} (Negotiable)`;
      case 'fixed':
      default:
        return formattedPrice;
    }
  };

  return (
    <span className={`font-semibold text-primary ${textSize} ${className}`}>
      {formatPrice()}
    </span>
  );
};

export default PriceTag;

