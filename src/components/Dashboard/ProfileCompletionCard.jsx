import Button from '../ui/Button';
import { Link } from 'react-router-dom';

const ProfileCompletionCard = ({ completion }) => {
    const isComplete = completion === 100;

    return (
        <div className={`rounded-[28px] p-6 shadow-xl border ${isComplete ? 'bg-green-500/10 border-green-500/20' : 'bg-white border-white/10'}`}>

            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className={`font-bold text-xl ${isComplete ? 'text-green-500' : 'text-slate-900'}`}>
                        {isComplete ? 'Your profile is complete!' : 'Your profile is incomplete!'}
                    </h3>

                    <p className={`text-sm mt-1 ${isComplete ? 'text-green-500/80' : 'text-slate-500'}`}>
                        {isComplete ? 'You have unlocked personalized features.' : 'Complete your profile to unlock predictors'}
                    </p>
                </div>

                <div className="text-3xl">
                    {isComplete ? '🎉' : '🚀'}
                </div>
            </div>

            <div className={`w-full h-3 rounded-full overflow-hidden ${isComplete ? 'bg-green-500/20' : 'bg-slate-200'}`}>
                <div
                    className={`h-full rounded-full transition-all duration-500 ${isComplete ? 'bg-green-500' : 'bg-primary-500'}`}
                    style={{ width: `${completion}%` }}
                />
            </div>

            <div className="flex items-center justify-between mt-5">
                <p className={`text-sm font-medium ${isComplete ? 'text-green-500' : 'text-slate-500'}`}>
                    {completion}% completed
                </p>

                {!isComplete && (
                    <Button onClick={() => window.location.href = '?tab=profile'}>
                        Complete Profile
                    </Button>
                )}
            </div>

        </div>
    );
};

export default ProfileCompletionCard;