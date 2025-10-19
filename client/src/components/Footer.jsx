const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 border-t border-slate-700 mt-auto py-6">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-slate-400">
          &copy; {currentYear} Lyrik Events. All rights reserved.
        </p>
        {/* Optional: Add more links here if needed */}
      </div>
    </footer>
  );
};

export default Footer;