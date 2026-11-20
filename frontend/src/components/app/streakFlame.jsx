export function StreakFlame({ className = "" }) {
  return (
    <svg viewBox="0 0 80 90" fill="none" aria-hidden="true" className={className}>
      <path
        d="M43 4C48 23 65 25 62 43C69 40 70 34 70 34C83 59 68 83 43 84C17 86 4 68 10 49C12 42 17 37 22 33C20 46 27 48 29 43C36 31 29 18 43 4Z"
        fill="#ff7438"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M40 43C45 53 55 55 55 65C55 76 47 81 38 79C25 77 23 65 29 58C29 66 34 65 35 61C38 54 35 50 40 43Z"
        fill="#ffe899"
      />
      <ellipse cx="30" cy="48" rx="3" ry="4.5" fill="currentColor" />
      <ellipse cx="51" cy="48" rx="3" ry="4.5" fill="currentColor" />
      <path d="M36 57Q41 62 46 56" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path
        d="M7 18V25M3.5 21.5H10.5M68 9V16M64.5 12.5H71.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
