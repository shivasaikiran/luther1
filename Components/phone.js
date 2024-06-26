import { BsFillShieldLockFill, BsTelephoneFill } from 'react-icons/bs';
import { CgSpinner } from 'react-icons/cg';
import OtpInput from 'otp-input-react';
import { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { auth } from '@/Firebase/config';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { toast, Toaster } from 'react-hot-toast';

const Phone = () => {
  const [otp, setOtp] = useState('');
  const [ph, setPh] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [user, setUser] = useState(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState(null); // State to hold RecaptchaVerifier instance

  const onCaptchVerify = () => {
    if (!recaptchaVerifier) {
      // Initialize recaptchaVerifier only if it's not already initialized
      setRecaptchaVerifier(
        new RecaptchaVerifier('recaptcha-container', {
          size: 'invisible',
          callback: (response) => {
            onSignup(); // Proceed with phone sign-in after reCAPTCHA verification
          },
          'expired-callback': () => {
            toast.error('reCAPTCHA verification expired. Please try again.');
          },
        })
      );
    } else {
      // If recaptchaVerifier already exists, you can directly proceed with phone sign-in
      onSignup();
    }
  };

  const onSignup = () => {
    setLoading(true);

    const appVerifier = recaptchaVerifier || window.recaptchaVerifier; // Prefer state variable over global window variable

    const formatPh = '+' + ph;

    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setShowOTP(true);
        toast.success('OTP sent successfully!');
      })
      .catch((error) => {
        console.error('Error sending OTP:', error);
        setLoading(false);
        toast.error('Failed to send OTP. Please try again.');
      });
  };

  const onOTPVerify = () => {
    setLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then((res) => {
        setUser(res.user);
        setLoading(false);
        toast.success('OTP verified successfully!');
      })
      .catch((err) => {
        console.error('Error verifying OTP:', err);
        setLoading(false);
        toast.error('Failed to verify OTP. Please try again.');
      });
  };

  return (
    <section className="flex items-center justify-center h-screen bg-emerald-500">
      <div>
        <Toaster toastOptions={{ duration: 4000 }} />
        <div id="recaptcha-container"></div>
        {user ? (
          <h2 className="text-2xl font-medium text-center text-white">
            👍 Login Success
          </h2>
        ) : (
          <div className="flex flex-col gap-4 p-4 rounded-lg w-80">
            <h1 className="mb-6 text-3xl font-medium leading-normal text-center text-white">
              Welcome to <br /> CODE A PROGRAM
            </h1>
            {showOTP ? (
              <>
                <div className="p-4 mx-auto bg-white rounded-full text-emerald-500 w-fit">
                  <BsFillShieldLockFill size={30} />
                </div>
                <label
                  htmlFor="otp"
                  className="text-xl font-bold text-center text-white"
                >
                  Enter your OTP
                </label>
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  OTPLength={6}
                  otpType="number"
                  disabled={loading}
                  autoFocus
                  className="otp-container"
                />
                <button
                  onClick={onOTPVerify}
                  className="bg-emerald-600 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded"
                >
                  {loading && (
                    <CgSpinner size={20} className="mt-1 animate-spin" />
                  )}
                  <span>Verify OTP</span>
                </button>
              </>
            ) : (
              <>
                <div className="p-4 mx-auto bg-white rounded-full text-emerald-500 w-fit">
                  <BsTelephoneFill size={30} />
                </div>
                <label
                  htmlFor=""
                  className="text-xl font-bold text-center text-white"
                >
                  Verify your phone number
                </label>
                <PhoneInput
                  country={'in'}
                  value={ph}
                  onChange={setPh}
                  inputClass="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                />
                <button
                  onClick={onCaptchVerify}
                  className="bg-emerald-600 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded"
                >
                  {loading && (
                    <CgSpinner size={20} className="mt-1 animate-spin" />
                  )}
                  <span>Send code via SMS</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Phone;
