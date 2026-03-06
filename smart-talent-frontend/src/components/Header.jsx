
// src/components/Header.jsx
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-white shadow-md px-6 py-4 relative">

      {/* Center Title */}
      <h1 className="text-4xl font-bold text-center">
        ResumeSync
      </h1>

      {/* Home button  */}
      <div className="absolute right-6 top-5">
        <Link
          to="/"
          className="font-semibold text-gray-700 hover:text-blue-600"
        >
          Home
        </Link>
      </div>

    </header>
  );
}