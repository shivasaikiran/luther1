import React, { useContext, useState, useEffect } from 'react';
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth, fireDB } from '@/Firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import { FaGoogle } from 'react-icons/fa';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { useRouter } from 'next/router';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import myContext from '@/Context/myContext';

const AuthOption = () => {
  const [isSignIn, setIsSignIn] = useState(true); // State to toggle between sign in and sign up
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showResetInput, setShowResetInput] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Retrieve stored values from localStorage on client side
    if (typeof window !== 'undefined') {
      const storedName = localStorage.getItem('authName') || '';
      const storedEmail = localStorage.getItem('authEmail') || '';
      setName(storedName);
      setEmail(storedEmail);
    }
  }, []);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await setDoc(doc(fireDB, "users", user.uid), {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
      });
      saveUserDataToLocal(user);
      router.push('/');
      toast.success('Successfully signed in with Google!');
    } catch (error) {
      console.error('Error during Google sign-in:', error);
      toast.error(error.message);
    }
  };

  const handleEmailSignIn = async () => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      saveUserDataToLocal(user);
      router.push('/');
      toast.success('Successfully logged in!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userData = {
        uid: user.uid,
        name: name,
        email: email,
        role: 'user', // Example: Set default role here
        date: new Date().toISOString(), // Example: Set registration date
      };
      await setDoc(doc(fireDB, "users", user.uid), userData);
      saveUserDataToLocal(user);
      toast.success('Successfully registered!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      toast.success('Password reset email sent! Check your inbox.');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const saveUserDataToLocal = (user) => {
    const userData = {
      uid: user.uid,
      name: user.displayName || name,
      email: user.email,
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem('userData', JSON.stringify(userData));
    }
  };

  const handleInputChange = (setterFunc, value, key) => {
    setterFunc(value);
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value); // Store the value in localStorage
    }
  };

  const context = useContext(myContext);
  const { loading, setLoading } = context;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer />
      
      <div className="w-full max-w-md px-6 py-8 bg-white rounded-lg shadow-md">
        <h1 className="mb-8 text-3xl font-bold text-center">{isSignIn ? 'Login' : 'Sign Up'}</h1>
        
        <div className="space-y-4">
          {!isSignIn && (
            <div className="mb-4">
              <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => handleInputChange(setName, e.target.value, 'authName')}
                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                required={!isSignIn}
              />
            </div>
          )}
        
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => handleInputChange(setEmail, e.target.value, 'authEmail')}
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => handleInputChange(setPassword, e.target.value)}
                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-700 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <MdVisibilityOff />
                ) : (
                  <MdVisibility />
                )}
              </button>
            </div>
          </div>
          {!isSignIn && (
            <div className="mb-4">
              <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-700 focus:outline-none"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <MdVisibilityOff />
                  ) : (
                    <MdVisibility />
                  )}
                </button>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between">
            <button
              onClick={isSignIn ? handleEmailSignIn : handleSignUp}
              className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
              type="button"
            >
              {isSignIn ? 'Login' : 'Sign Up'}
            </button>
            <button
              onClick={() => setIsSignIn(!isSignIn)}
              className="inline-block text-sm font-bold text-blue-500 align-baseline hover:text-blue-800"
              type="button"
            >
              {isSignIn ? 'Create an account' : 'Already have an account?'}
            </button>
          </div>
          {isSignIn && (
            <div className="mt-4">
              <button
                onClick={() => setShowResetInput(!showResetInput)}
                className="block mb-2 text-sm font-bold text-blue-500 focus:outline-none"
                type="button"
              >
                Forgot your password?
              </button>
              {showResetInput && (
                <div className="flex items-center space-x-2">
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  />
                  <button
                    onClick={handleResetPassword}
                    className="px-4 py-2 font-bold text-white bg-gray-500 rounded hover:bg-gray-700 focus:outline-none focus:shadow-outline"
                    type="button"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="mt-6">
          <button
            onClick={handleGoogleSignIn}
            className="flex items-center justify-center w-full px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700 focus:outline-none focus:shadow-outline"
            type="button"
          >
            <FaGoogle className="mr-2" /> Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthOption;
