export default function FarmerSection() {
  const perks = [
    {
      title: 'Zero listing fees',
      desc: 'Put up as many products as you need. We charge nothing to list.',
    },
    {
      title: 'Set your own prices',
      desc: 'You know the cost of your work better than anyone. Price accordingly.',
    },
    {
      title: 'Direct payments',
      desc: 'Payments go straight to your account. No delays, no holdbacks.',
    },
  ];

  return (
    <div id="farmers" className="farmer-section">
      <div className="farmer-left">
        <div className="section-eyebrow">For Farmers</div>
        <h2 className="section-title" style={{ maxWidth: '400px', marginBottom: '1.5rem' }}>
          Your harvest, your <em>price.</em>
        </h2>
        <p style={{ color: 'var(--mist)', lineHeight: 1.8, maxWidth: '360px', marginBottom: '2.5rem' }}>
          No commission agents. No wholesale floors. You decide what you grow, what you
          charge, and who you sell to. Agriconnect is your direct line to customers
          who value what you do.
        </p>
        <a href="#" className="btn-primary">
          Register as a Farmer
        </a>

        <div className="farmer-perks">
          {perks.map((perk, idx) => (
            <div
              key={perk.title}
              className="perk"
              style={{ transitionDelay: `${idx * 0.12}s` }}
            >
              <div className="perk-icon">◈</div>
              <div className="perk-text">
                <strong>{perk.title}</strong>
                <span>{perk.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="farmer-right">
        <p>
          &ldquo;Farming is not just a profession — it is the oldest and most honest
          conversation between human beings and the earth.&rdquo;
        </p>
        <div className="attribution">— Agriconnect, on why we exist</div>
        <svg
          style={{ position: 'absolute', bottom: '2rem', right: '2rem', opacity: 0.06 }}
          width="200"
          height="200"
          viewBox="0 0 200 200"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="100" cy="100" r="90" stroke="white" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="65" stroke="white" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="40" stroke="white" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="15" stroke="white" strokeWidth="0.5" />
        </svg>
      </div>
    </div>
  );
}
