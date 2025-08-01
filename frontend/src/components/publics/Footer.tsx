export function Footer() {
    return (
      <footer className="bg-white mt-8 py-6">
        <div className="container mx-auto text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} GiftShop. All rights reserved.
          <span className="mx-2">|</span>
          <a href="#" className="hover:underline mx-2">Contact</a>
          <a href="#" className="hover:underline mx-2">Terms of Service</a>
          <a href="#" className="hover:underline mx-2">Privacy Policy</a>
        </div>
      </footer>
    );
  }
  