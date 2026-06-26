import { useState } from "react";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        alert("OTP sent to your email");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black px-4">
            <div className="w-full max-w-md bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
                <h1 className="text-3xl font-bold text-white mb-6 text-center">
                    Forgot Password
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 rounded-lg bg-zinc-800 text-white outline-none"
                        required
                    />

                    <button
                        type="submit"
                        className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-lg"
                    >
                        Send OTP
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;