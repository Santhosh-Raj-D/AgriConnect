export default function Testimonials() {
  const testimonials = [
    {
      quote:
        '"Before Agriconnect I was selling tomatoes at ₹12/kg to the mandi. Now my buyers pay ₹40 directly. Same tomatoes. My family eats better now."',
      avatar: '🧑‍🌾',
      name: 'Ravi Kumar',
      role: 'Farmer · Ludhiana, Punjab',
      avatarBg: 'rgba(43,82,64,0.4)',
    },
    {
      quote:
        '"I know exactly which farm my vegetables come from. I can see when they were harvested. That peace of mind — you cannot get it from a supermarket."',
      avatar: '👩',
      name: 'Priya Nair',
      role: 'Buyer · Bengaluru',
      avatarBg: 'rgba(28,56,40,0.4)',
    },
    {
      quote:
        '"My ghee is now sold in five cities. People who care about quality found me here. I never imagined sitting in Mathura and having customers in Chennai."',
      avatar: '🧑‍🌾',
      name: 'Vijay Rao',
      role: 'Farmer · Mathura, UP',
      avatarBg: 'rgba(43,82,64,0.4)',
    },
  ];

  return (
    <section className="testimonials-section">
      <div className="reveal" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 1rem' }}>
        <div className="section-eyebrow">Voices from the field</div>
        <h2 className="section-title">
          What our community <em>says.</em>
        </h2>
      </div>
      <div className="test-grid">
        {testimonials.map((test, idx) => (
          <div
            key={test.name}
            className="test-card"
            style={{ transitionDelay: `${idx * 0.15}s` }}
          >
            <div className="test-quote">{test.quote}</div>
            <div className="test-author">
              <div
                className="test-avatar"
                style={{ backgroundColor: test.avatarBg, fontSize: '1.1rem' }}
              >
                {test.avatar}
              </div>
              <div>
                <div className="test-name">{test.name}</div>
                <div className="test-role">{test.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
