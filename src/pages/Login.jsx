import AuthModal from '../components/auth/AuthModal';

export default function Login() {
  return <AuthModal isOpen={true} onClose={() => {}} defaultTab="login" />;
}
