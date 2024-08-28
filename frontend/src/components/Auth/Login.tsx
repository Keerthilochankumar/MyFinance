"use client";
import React, { useState } from "react";
import { Label } from "../magicui/label";
import { Input } from "../magicui/input";
import { cn } from "../lib/utils";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useAuth } from "../../context/AuthContext";

export function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/signin', { email, password });
      const token = response.data.token;
      localStorage.setItem('token', token);
      setToken(token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black mt-24">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        {t('login.welcome')}
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        {t('login.description')}
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">{t('login.emailLabel')}</Label>
          <Input id="email" placeholder="projectmayhem@fc.com" type="email"
          onChange={(e) => setEmail(e.target.value)} />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">{t('login.passwordLabel')}</Label>
          <Input id="password" placeholder="••••••••" type="password"
          onChange={(e) => setPassword(e.target.value)} />
        </LabelInputContainer>
        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
          onClick={handleRegister}
        >
          {t('login.signInButton')}
          <BottomGradient />
        </button>
      </form>
      <div>
        <button className='mt-5 flex mx-auto' onClick={()=>{navigate("/signup")}}>
          {t('login.signUpPrompt')}
        </button>
      </div>
    </div>
  );
}

const BottomGradient = () => (
  <>
    <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
    <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
  </>
);

const LabelInputContainer = ({ children, className }: { children: React.ReactNode; className?: string; }) => (
  <div className={cn("flex flex-col space-y-2 w-full", className)}>
    {children}
  </div>
);

export default Login;
