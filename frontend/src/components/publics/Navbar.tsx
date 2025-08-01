import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <nav className="bg-white shadow mb-6">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <Link to="/" className="text-xl font-bold text-blue-600">GiftShop</Link>
        <div>
          <Link to="/login" className="text-blue-600 hover:underline mr-4">Login</Link>
          <Link to="/register" className="text-blue-600 hover:underline mr-4">Register</Link>
          {/* <Link to="/cart" className="text-blue-600 hover:underline">Cart</Link> */}
        </div>
      </div>
    </nav>
  );
}
