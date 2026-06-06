import Counter from './Counter';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  role: string;
}

export default function Hero({ user }: { user: User | null }) {
  const getDashboardLink = () => {
    if (!user) return '/signup';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    if (user.role === 'FARMER') return '/farmer/dashboard';
    return '/buyer/dashboard';
  };

  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="hero-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      {/* SVG illustration of produce */}
      <svg
        className="hero-illustration"
        viewBox="0 0 420 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Large circle background */}
        <circle
          cx="210"
          cy="210"
          r="180"
          fill="rgba(28,56,40,0.3)"
          stroke="rgba(75,124,92,0.15)"
          strokeWidth="0.5"
        />
        <circle
          cx="210"
          cy="210"
          r="140"
          fill="rgba(28,56,40,0.2)"
          stroke="rgba(75,124,92,0.1)"
          strokeWidth="0.5"
        />

        {/* Tomato */}
        <g transform="translate(140,140)">
          <circle cx="0" cy="0" r="38" fill="#8B2020" opacity="0.85" />
          <circle cx="-10" cy="-8" r="14" fill="rgba(255,80,80,0.2)" />
          <path
            d="M0,-38 C0,-48 8,-55 0,-62 M-6,-38 C-12,-46 -18,-50 -14,-60 M6,-38 C12,-46 18,-50 14,-60"
            stroke="#2B5240"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>

        {/* Corn */}
        <g transform="translate(270,160) rotate(25)">
          <ellipse cx="0" cy="0" rx="14" ry="36" fill="#C4A832" opacity="0.9" />
          <ellipse cx="0" cy="0" rx="10" ry="30" fill="#D4B840" opacity="0.5" />
          <line
            x1="-6"
            y1="-28"
            x2="-6"
            y2="28"
            stroke="rgba(180,140,20,0.4)"
            strokeWidth="1"
          />
          <line
            x1="0"
            y1="-32"
            x2="0"
            y2="32"
            stroke="rgba(180,140,20,0.4)"
            strokeWidth="1"
          />
          <line
            x1="6"
            y1="-28"
            x2="6"
            y2="28"
            stroke="rgba(180,140,20,0.4)"
            strokeWidth="1"
          />
          <path
            d="M-14,-36 C-20,-50 0,-58 14,-36"
            stroke="#2B5240"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
        </g>

        {/* Apple */}
        <g transform="translate(180,270)">
          <path
            d="M0,-34 C-30,-34 -40,-10 -38,10 C-36,32 -20,44 0,44 C20,44 36,32 38,10 C40,-10 30,-34 0,-34 Z"
            fill="#5A1A10"
            opacity="0.9"
          />
          <circle cx="-10" cy="-10" r="10" fill="rgba(180,60,40,0.25)" />
          <path
            d="M0,-34 C0,-48 10,-54 6,-62"
            stroke="#2B5240"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M4,-48 C14,-52 20,-46 16,-38"
            stroke="#2B5240"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* Milk bottle */}
        <g transform="translate(280,270)">
          <rect
            x="-16"
            y="-36"
            width="32"
            height="60"
            rx="4"
            fill="rgba(216,232,208,0.12)"
            stroke="rgba(143,184,154,0.4)"
            strokeWidth="1"
          />
          <rect
            x="-10"
            y="-48"
            width="20"
            height="16"
            rx="4"
            fill="rgba(216,232,208,0.08)"
            stroke="rgba(143,184,154,0.3)"
            strokeWidth="1"
          />
          <ellipse cx="0" cy="-2" rx="10" ry="16" fill="rgba(255,255,255,0.05)" />
          <text
            x="0"
            y="14"
            textAnchor="middle"
            fill="rgba(143,184,154,0.6)"
            fontSize="8"
            fontFamily="serif"
          >
            MILK
          </text>
        </g>

        {/* Leafy greens */}
        <g transform="translate(145,255)">
          <path
            d="M0,0 C-20,-30 -10,-50 0,-40 C10,-50 20,-30 0,0"
            fill="#1C3828"
            opacity="0.9"
            stroke="rgba(75,124,92,0.4)"
            strokeWidth="0.5"
          />
          <path
            d="M0,0 C-15,-25 -5,-42 0,-32 C5,-42 15,-25 0,0"
            fill="#2B5240"
            opacity="0.8"
          />
          <path
            d="M-14,-22 C-8,-10 8,-10 14,-22"
            stroke="rgba(75,124,92,0.3)"
            strokeWidth="0.5"
            fill="none"
          />
        </g>
        <g transform="translate(160,245) rotate(-20)">
          <path
            d="M0,0 C-18,-28 -8,-46 0,-38 C8,-46 18,-28 0,0"
            fill="#2B5240"
            opacity="0.7"
          />
        </g>

        {/* Decorative ring dots */}
        <g opacity="0.3">
          <circle cx="210" cy="36" r="2.5" fill="#D4A853" />
          <circle cx="354" cy="120" r="2.5" fill="#D4A853" />
          <circle cx="370" cy="272" r="2.5" fill="#D4A853" />
          <circle cx="278" cy="378" r="2.5" fill="#D4A853" />
          <circle cx="142" cy="378" r="2.5" fill="#D4A853" />
          <circle cx="50" cy="272" r="2.5" fill="#D4A853" />
          <circle cx="66" cy="120" r="2.5" fill="#D4A853" />
        </g>
      </svg>

      <div className="hero-eyebrow">India&apos;s Direct Farm Network · Est. 2024</div>

      <h1 className="hero-title">
        From the <em>farm</em>
        <br />
        to your table,
        <br />
        nothing in between.
      </h1>

      <p className="hero-desc">
        Agriconnect links farmers directly to buyers — no middlemen, no markups. Real
        produce, real prices, real people behind every harvest.
      </p>

      <div className="hero-actions">
        <Link href={user ? '/store' : '/login'} className="btn-primary">
          {user ? 'Go to Store' : 'Browse Produce'}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
        <Link href={getDashboardLink()} className="btn-ghost">
          {user ? 'View Dashboard' : 'Sell as a Farmer'}
        </Link>
      </div>

      <div className="hero-stats">
        <div className="stat">
          <Counter target={1240} suffix="+" />
          <div className="stat-label">Farmers registered</div>
        </div>
        <div className="stat">
          <Counter target={8700} suffix="+" />
          <div className="stat-label">Active buyers</div>
        </div>
        <div className="stat">
          <Counter target={3400} suffix="+" />
          <div className="stat-label">Products listed</div>
        </div>
      </div>

      <div className="scroll-indicator">
        <div className="scroll-line" />
        <span className="scroll-text">Scroll</span>
      </div>
    </section>
  );
}
