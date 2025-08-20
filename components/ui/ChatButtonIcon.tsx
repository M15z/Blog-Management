export default function ChatButtonIcon() {
  return (
    <div className="mr-4 p-2 rounded-full transition-colors duration-200 hover:bg-gray-200">
      <svg
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
      >
        <path
          d="M20 2H4C2.9 2 2 2.9 2 4v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2z"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
        <line
          x1="6"
          y1="8"
          x2="18"
          y2="8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="6"
          y1="12"
          x2="14"
          y2="12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}