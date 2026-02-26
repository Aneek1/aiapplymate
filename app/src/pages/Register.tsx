import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Zap, Loader2, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await register(formData);
            toast.success('Account created successfully!');
            navigate('/dashboard');
        } catch (error: any) {
            toast.error(error.message || 'Registration failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#064e3b] relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-400 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500 rounded-full blur-[100px]" />
            </div>

            <div className="w-full max-w-lg p-8 relative z-10">
                <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-200">
                            <Zap className="text-white w-6 h-6 fill-current" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Join TailorCV</h1>
                        <p className="text-gray-500 text-sm mt-1">Start tailoring your career today</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 antialiased">
                                    First Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        name="firstName"
                                        required
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none text-gray-900"
                                        placeholder="John"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 antialiased">
                                    Last Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        name="lastName"
                                        required
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none text-gray-900"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 antialiased">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none text-gray-900"
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 antialiased">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none text-gray-900"
                                    placeholder="Min. 6 characters"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-emerald-600 font-bold hover:text-emerald-700">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
