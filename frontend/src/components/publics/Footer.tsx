export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12 py-6">
      <div className="container mx-auto text-center text-gray-600 text-sm space-x-4">
        &copy; {new Date().getFullYear()} GiftShop. All rights reserved.
        <a href="/contact" className="hover:underline">Contact</a>
        <a href="/terms" className="hover:underline">Terms of Service</a>
        <a href="/privacy" className="hover:underline">Privacy Policy</a>
      </div>
    </footer>
  );
}
