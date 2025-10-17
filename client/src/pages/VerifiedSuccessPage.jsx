const VerifiedSuccessPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-white">
      <h1 className="text-3xl font-bold mb-4">✅ Email Verified Successfully!</h1>
      <p className="text-slate-400">You can now log in to your account.</p>
      <a
        href="/login"
        className="mt-6 bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg text-white font-semibold"
      >
        Go to Login
      </a>
    </div>
  );
};

export default VerifiedSuccessPage;
