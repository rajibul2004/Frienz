import { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";
import { Check, X, Mail, Lock, User, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { authHooks } from "../hooks/authHooks";

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { isPending: isRegistering, registerMutation } = authHooks.useRegister();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await registerMutation({ formData });
      sessionStorage.clear();
      toast.success("Account created successfully!");
      navigate("/onboarding");
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    }
  }

  useEffect(() => {
    const savedEmail = sessionStorage.getItem("signupEmail");
    const savedName = sessionStorage.getItem("signupName");
    const savedPassword = sessionStorage.getItem("signupPassword");
    if (savedEmail) {
      setFormData({ ...formData, email: savedEmail });
    }
    if (savedName) {
      setFormData({ ...formData, name: savedName });
    }
    if (savedPassword) {
      setFormData({ ...formData, password: savedPassword });
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20"
      >
        <div className="flex flex-col lg:flex-row">
          {/* Left Side - Form */}
          <div className="w-full lg:w-1/2 p-8 lg:p-12">
            <div className="mb-8">
              <img src={assets.logo} alt="Frienz" className="h-12 w-auto" />
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Create account</h2>
              <p className="text-white/60 milky:text-gray-800/60">
                Join Frienz. Your Squad is Waiting.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80 milky:text-gray-800/80 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full name
                </label>
                <input
                  type="text"
                  placeholder="Rajibul Hazari"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    sessionStorage.setItem("name", e.target.value);
                  }}
                  className="w-full px-4 py-3 Input"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80 milky:text-gray-800/80 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="rajibulhazari@gmail.com"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      sessionStorage.setItem("email", e.target.value);
                    }}
                    className="w-full px-4 py-3 Input pr-24"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80 milky:text-gray-800/80 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </label>
                <input
                  type="password"
                  placeholder="******"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    sessionStorage.setItem("password", e.target.value);
                  }}
                  className="w-full px-4 py-3 Input"
                  required
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-3 btn-primary-theme"
              >
                <span>{isRegistering ? "Creating account..." : "Sign Up"}</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </form>

            <p className="mt-6 text-center text-white/60 milky:text-gray-800/60">
              Already have an account?
              <button
                onClick={() => navigate("/login")}
                className="link-text font-medium "
              >
                Sign in
              </button>
            </p>
          </div>

          {/* Right Side - Illustration */}
          <div className="hidden lg:flex w-1/2 bg-linear-to-br forest:from-green-600/20 forest:to-emerald-600/20 synthwave:from-pink-600/20 synthwave:to-purple-600/20 midnight:from-gray-600/20 midnight:to-slate-600/20 milky:from-blue-300/10 milky:to-indigo-300/10 aqua:from-cyan-500/20 aqua:to-teal-500/20 luxury:from-cyan-500/20 luxury:to-teal-500/20 items-center justify-center p-12">
            <div className="text-center">
              <motion.div
                animate={{
                  y: [0, -20, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="mb-8"
              >
                <img
                  src={assets.video_call}
                  alt="Video call illustration"
                  className="w-96 h-auto"
                />
              </motion.div>
              <h3 className="text-2xl font-bold  mb-4">
                Where Friends Become Family
              </h3>
              <p className="text-lg milky:text-gray-800/60 text-white/60">
                Designed not just for talking,
                <br />
                but for feeling connected.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
