import { useState } from 'react';
import { Eye, EyeOff, LoaderCircle, Zap } from 'lucide-react';
import { useQuestlishStore } from '../store/useQuestlishStore.js';

export default function AuthScreen() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', identifier: '', password: '', remember: true });
  const [showPassword, setShowPassword] = useState(false);
  const { authenticate, authStatus, authError } = useQuestlishStore();
  const isLoading = authStatus === 'loading';
  const emailInvalid = mode === 'register' && form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const passwordInvalid = form.password && form.password.length < 8;

  const change = ({ target }) => setForm((old) => ({ ...old, [target.name]: target.type === 'checkbox' ? target.checked : target.value }));
  const submit = (event) => {
    event.preventDefault();
    if (emailInvalid || form.password.length < 8) return;
    authenticate(mode, form, form.remember);
  };
  const switchMode = () => { setMode((value) => value === 'login' ? 'register' : 'login'); setForm({ name: '', email: '', identifier: '', password: '', remember: true }); };

  return (
    <main className="min-h-screen bg-[#0b0813] text-white grid lg:grid-cols-2" aria-label="Questlish authentication">
      <section className="hidden lg:flex p-16 flex-col justify-between bg-gradient-to-br from-[#17102b] to-[#0b0813]" aria-label="Welcome to Questlish">
        <h1 id="app-name" className="flex items-center gap-3 text-2xl font-bold"><span className="p-2.5 rounded-xl bg-violet-600" aria-hidden="true"><Zap /></span>Questlish</h1>
        <div><p className="text-violet-300 font-bold tracking-widest text-sm mb-4">YOUR ENGLISH QUEST</p><h1 className="text-5xl font-black leading-tight">Your progress goes wherever you go.</h1><p className="text-gray-300 mt-5 text-lg max-w-lg">Learn, earn XP, and keep your streak synced across all your devices.</p></div>
        <p className="text-gray-400 text-sm">Accessible learning · B1 level</p>
      </section>
      <section className="flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-[#151026] border border-violet-800/40 rounded-3xl p-7 sm:p-9 shadow-2xl">
          <h1 id="app-name-mobile" className="lg:hidden flex items-center gap-2 mb-8 font-bold text-xl"><Zap className="text-violet-400" aria-hidden="true" />Questlish</h1>
          <h2 id="auth-title" className="text-3xl font-black">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
          <p className="text-gray-300 mt-2 mb-7">{mode === 'login' ? 'Continue your learning adventure.' : 'Start saving your progress today.'}</p>
          <form onSubmit={submit} noValidate>
            {mode === 'register' && <Field label="Username" name="name" value={form.name} onChange={change} autoComplete="name" minLength={2} />}
            {mode === 'register'
              ? <Field label="Email address" name="email" type="email" value={form.email} onChange={change} autoComplete="email" invalid={emailInvalid} help={emailInvalid ? 'Enter a valid email, for example name@example.com.' : ''} />
              : <Field label="Email or username" name="identifier" value={form.identifier} onChange={change} autoComplete="username" />}
            <div className="relative">
              <Field label="Password" name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={change} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} invalid={passwordInvalid} help={passwordInvalid ? 'Your password must be at least 8 characters long.' : 'At least 8 characters.'} />
              <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-10 p-1.5 text-gray-300 hover:text-white rounded-lg" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={19} aria-hidden="true" /> : <Eye size={19} aria-hidden="true" />}</button>
            </div>
            <label className="flex gap-3 items-center text-sm text-gray-200 my-5 cursor-pointer"><input name="remember" type="checkbox" checked={form.remember} onChange={change} className="w-4 h-4 accent-violet-600" />Keep me signed in</label>
            <div aria-live="polite" className="min-h-6 text-sm text-rose-300 mb-2">{authError}</div>
            <button disabled={isLoading} className="w-full min-h-12 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-60 font-bold flex items-center justify-center gap-2">{isLoading && <LoaderCircle className="animate-spin" aria-hidden="true" />}{isLoading ? 'Signing in…' : mode === 'login' ? 'Sign in' : 'Create account'}</button>
          </form>
          <p className="text-center text-gray-300 mt-6">{mode === 'login' ? "Don't have an account yet?" : 'Already have an account?'} <button onClick={switchMode} className="text-violet-300 font-bold hover:text-violet-200">{mode === 'login' ? 'Sign up' : 'Sign in'}</button></p>
        </div>
      </section>
    </main>
  );
}

function Field({ label, help, invalid, ...props }) {
  const id = `auth-${props.name}`;
  return <div className="mb-4"><label htmlFor={id} className="block text-sm font-semibold text-gray-200 mb-2">{label}</label><input id={id} required aria-invalid={Boolean(invalid)} aria-describedby={help ? `${id}-help` : undefined} {...props} className="w-full bg-[#0d0a18] border border-violet-800/60 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:border-violet-400 outline-none" />{help && <p id={`${id}-help`} className={`text-xs mt-1.5 ${invalid ? 'text-rose-300' : 'text-gray-400'}`}>{help}</p>}</div>;
}
