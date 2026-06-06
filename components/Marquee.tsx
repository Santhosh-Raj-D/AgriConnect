export default function Marquee() {
  const items = [
    'Fresh Tomatoes',
    'Organic Milk',
    'Rice Varieties',
    'Local Mangoes',
    'Free Range Eggs',
    'Mustard Oil',
    'Bitter Gourd',
    'Paneer',
    'Turmeric Roots',
    'Spinach Bundles',
  ];

  // Repeat items to guarantee smooth seamless marquee scrolling loop
  const duplicatedItems = [...items, ...items];

  return (
    <div className="marquee-wrap">
      <div className="marquee-track" id="marqueeTrack">
        {duplicatedItems.map((item, index) => (
          <span key={index} className="marquee-item">
            <span className="marquee-dot" /> {item}
          </span>
        ))}
      </div>
    </div>
  );
}
