import {
  ArrowRight,
  Lock,
  Mail,
  CheckCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { useState, useRef } from "react";
import { authHooks } from "../hooks/authHooks";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const { sendMutation } = authHooks.useSendResetOtp();
  const { verifyOtpMutation } = authHooks.useVerifyResetOtp();
  const { resetPasswordMutation } = authHooks.useResetPassword();

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeydown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const onEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await sendMutation({ email });
      toast.success("OTP sent successfully! 📧", {
        icon: "✉️",
      });
      setStep(2);
    } catch (error) {
      toast.error(error.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const onOtpSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const otpArray = inputRefs.current.map((e) => e.value);
      const otp = otpArray.join("");

      if (otp.length !== 6) {
        toast.error("Please enter complete OTP");
        setIsLoading(false);
        return;
      }

      await verifyOtpMutation({ email, otp });
      toast.success("OTP verified successfully! ✓");
      setStep(3);
    } catch (err) {
      toast.error(err.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const onResetSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await resetPasswordMutation({ email, newPassword });
      toast.success("Password reset successfully! 🎉");

      // Redirect to login after successful reset
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      toast.error(error.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      await sendMutation({ email });
      toast.success("OTP resent successfully! 📧");
    } catch (error) {
      toast.error(error.message || "Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className="bg-transparent flex items-center justify-center h-full flex-col">
      {/* Main Content */}
      <div className="w-full max-w-md  p-4">
        {/* Progress Steps */}
        <div className="mb-8 px-4">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  onClick={() => {
                    if (step >= s) {
                      setStep(s);
                    }
                  }}
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    ${
                      step >= s
                        ? "active cursor-pointer"
                        : "bg-white/5 milky:bg-gray-900/5 text-white/40 milky:text-gray-900/40 border border-white/10 milky:border-gray-900/10"
                    }
                  `}
                >
                  {step > s ? <CheckCircle className="w-4 h-4" /> : s}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs">Email</span>
            <span className="text-xs ">Verify</span>
            <span className="text-xs ">Reset</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Email */}
          {step === 1 && (
            <motion.div
              key="email"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl"
            >
              <button
                onClick={() => navigate("/login")}
                className="flex items-center w-full justify-end gap-2 text-sm text-white/60 milky:text-gray-900/60 hover:text-white milky:hover:text-gray-900 transition-colors cursor-pointer"
              >
                <ArrowLeft />
                <span>Back to login</span>
              </button>
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 active rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold mb-2">
                  Enter Your Email
                </h2>
                <p className="text-white/60 milky:text-gray-900/60 text-sm">
                  We'll send a verification code to your email
                </p>
              </div>

              <form onSubmit={onEmailSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80 milky:text-gray-800/80 ">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40 milky:text-gray-900/40" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="rajibul@gmail.com"
                      className="w-full pl-10 pr-4 py-3  Input"
                      required
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 btn-primary-theme font-medium rounded-xl  transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send OTP
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          )}

          {/* Step 2: OTP */}
          {step === 2 && (
            <motion.div
              key="otp"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl"
            >
              <button
                onClick={() => navigate("/login")}
                className="flex items-center w-full justify-end gap-2 text-sm text-white/60 milky:text-gray-900/60 hover:text-white milky:hover:text-gray-900 transition-colors cursor-pointer"
              >
                <ArrowLeft />
                <span>Back to login</span>
              </button>
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 active rounded-full flex items-center justify-center">
                  <Lock className="w-8 h-8 " />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold  mb-2">
                  Enter Verification Code
                </h2>
                <p className="text-white/60 milky:text-gray-900/60 text-sm">
                  We've sent a 6-digit code to {email}
                </p>
              </div>

              <form onSubmit={onOtpSubmit} className="space-y-6">
                <div
                  className="flex gap-2 justify-center"
                  onPaste={handlePaste}
                >
                  {Array(6)
                    .fill(0)
                    .map((_, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength="1"
                        required
                        className="w-12 h-12 text-center Input text-xl font-semibold "
                        ref={(e) => (inputRefs.current[index] = e)}
                        onInput={(e) => handleInput(e, index)}
                        onKeyDown={(e) => handleKeydown(e, index)}
                      />
                    ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 btn-primary-theme font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify OTP"
                  )}
                </motion.button>

                <p className="text-center text-sm text-white/40 milky:text-gray-900/40">
                  Didn't receive the code?{" "}
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isLoading}
                    className="link-text font-medium transition-colors disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                </p>
              </form>
            </motion.div>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <motion.div
              key="password"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl"
            >
              <button
                onClick={() => navigate("/login")}
                className="flex items-center w-full justify-end gap-2 text-sm text-white/60 milky:text-gray-900/60 hover:text-white milky:hover:text-gray-900 transition-colors cursor-pointer"
              >
                <ArrowLeft />
                <span>Back to login</span>
              </button>
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 active rounded-full flex items-center justify-center">
                  <Lock className="w-8 h-8 " />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold  mb-2">
                  Set New Password
                </h2>
                <p className="text-white/60 milky:text-gray-900/60 text-sm">
                  Enter your new password below
                </p>
              </div>

              <form onSubmit={onResetSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80 milky:text-gray-900/80">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40 milky:text-gray-900/40" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 rounded-xl Input"
                      required
                      minLength={6}
                    />
                  </div>
                  <p className="text-xs text-white/40 milky:text-gray-900/40 mt-1">
                    Minimum 6 characters
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading || newPassword.length < 6}
                  className="w-full py-3 font-medium rounded-xl btn-primary-theme transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ResetPassword;
