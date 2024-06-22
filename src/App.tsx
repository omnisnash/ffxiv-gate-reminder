import { useEffect, useState } from 'react';
import ReactConfetti from 'react-confetti';
import { useLocalStorage, useWindowSize } from 'usehooks-ts';
import OptionSection from './components/OptionSection';
import Toggle from './components/Toggle';
import { formatTimestampHoursMinutes, formatTimestampMinutesSecondes } from './time-utils';
import { useTimeHook } from './useTimeHook';

import iconSrc from '@/assets/favicon.png';
import gateSrc from '@/assets/gate.png';
import errorSound from '@/assets/sounds/FFXIV_Error.mp3';
import fateSound from '@/assets/sounds/FFXIV_FATE01_Start.mp3';
import featureUnlockedSound from '@/assets/sounds/FFXIV_Feature_Unlocked.mp3';
import linkshellSound from '@/assets/sounds/FFXIV_Linkshell_Transmission.mp3';
import notificationSound from '@/assets/sounds/FFXIV_Notification.mp3';
import winLotSound from '@/assets/sounds/FFXIV_Win_Lot.mp3';

const START_ANNOUNCE_DURATION = 7000;

export function App() {
    const [isReminderEnabled, setReminderEnable] = useLocalStorage<boolean>('reminder-enabled', false);
    const [isSoundEnabled, setSoundEnabled] = useState<boolean>(false);
    const [isNotificationEnabled, setNotificationEnabled] = useLocalStorage<boolean>('notification-enabled', false);
    const [selectedSound, setSelectedSound] = useLocalStorage<string>('selected-sound', notificationSound);
    const [remindInMinutes, setRemindInMinutes] = useLocalStorage<number>('reminder-time', 0);
    const [isStarting, setStarting] = useState<boolean>(false);

    const { width, height } = useWindowSize();

    const enableRemind = isReminderEnabled && remindInMinutes;

    const handleRemindStart = () => {
        if (!enableRemind) {
            return;
        }
        notifyGate(true);
    };

    const handleGateStart = () => {
        setStarting(true);
        setTimeout(() => setStarting(false), START_ANNOUNCE_DURATION);

        if (enableRemind) {
            return;
        }
        notifyGate();
    };

    const notifyGate = (remind?: boolean) => {
        if (isSoundEnabled) {
            playSelectedSound();
        }

        if (isNotificationEnabled) {
            sendNotification(remind ? `Gate will start in ${remindInMinutes} minutes!` : `Gate is starting!`);
        }
    };

    const handleReminderActivationChange = () => {
        setReminderEnable((prev) => !prev);
    };

    const handleReminderTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRemindInMinutes(parseInt(event.target.value) ?? undefined);
        setReminderEnable(event.target.value !== '0');
    };

    const handleSoundActivationChange = () => {
        setSoundEnabled((prev) => !prev);
    };

    const handleSelectedSoundChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSound(event.target.value);
    };

    const playSelectedSound = () => {
        const sound = new Audio(selectedSound);
        sound.play();
    };

    const handleNotificationActivationChange = () => {
        setNotificationEnabled((prev) => !prev);

        if (!('Notification' in window)) {
            setNotificationEnabled(false);
        }

        if (Notification.permission !== 'denied') {
            Notification.requestPermission().then((permission) => {
                if (permission === 'denied') {
                    setNotificationEnabled(false);
                }
            });
        }
    };

    const sendNotification = (title: string) => {
        try {
            if (typeof window === 'undefined' || !Notification) {
                return;
            }

            Notification.requestPermission().then((permission) => {
                if (permission === 'granted') {
                    new Notification(title, { icon: iconSrc });
                }
            });
        } catch (error) {
            if (error instanceof TypeError) {
                Notification.requestPermission(() => {
                    new Notification(title, { icon: iconSrc });
                });
            } else {
                throw error;
            }
        }
    };

    const { timeUntil, nextGates } = useTimeHook({
        onGateStart: handleGateStart,
        onRemind: handleRemindStart,
        remindInMinutes: remindInMinutes,
    });

    useEffect(() => {
        document.title = 'Next GATE: ' + formatTimestampMinutesSecondes(timeUntil);
    }, [timeUntil]);

    return (
        <main className={'m-auto max-w-md p-4'}>
            {isStarting && <ReactConfetti width={width} height={height} numberOfPieces={100} />}

            <header className={'text-center mb-6 mt-6'}>
                <img src={gateSrc} className={'m-auto'} />
            </header>

            <section className={'text-center mb-6'}>
                <p className={'text-md uppercase font-semibold text-yellow-500 dark:text-yellow-300 mb-1'}>next gate</p>
                <p className={'text-6xl font-semibold font-mono dark:text-white'}>
                    {isStarting ? 'Now!' : formatTimestampMinutesSecondes(timeUntil)}
                </p>
            </section>

            <section className={'text-center relative mb-16'}>
                <div
                    className={
                        'absolute h-0 w-0 border-x-8 border-x-transparent border-b-[16px] border-b-lime-700 rotate-90 right-0  -z-10 -translate-y-1/2 top-1/2 bottom-1/2'
                    }
                />
                <hr className={'absolute top-1/2 bottom-1/2 h-1   bg-lime-700  border-0 left-0 right-1 -z-10 -translate-y-1/2'} />
                <div className={'flex items-center gap-4 justify-center'}>
                    {nextGates.map((next, index) => (
                        <div
                            className={
                                'px-2.5 py-0.5 font-mono font-semibold rounded-full text-sm text-slate-900 bg-gradient-to-b border-lime-700  border-2 from-orange-500 to-yellow-300 '
                            }
                            key={index}
                        >
                            {formatTimestampHoursMinutes(next)}
                        </div>
                    ))}
                </div>
            </section>

            <OptionSection>
                <div className={' flex items-center gap-4 mb-2'}>
                    <Toggle checked={isSoundEnabled} onChange={handleSoundActivationChange} />
                    <h3 className={'font-semibold text-lg'}>Sound</h3>
                </div>
                <div className={'flex items-center gap-2'}>
                    <label className="text-sm text-gray-500 dark:text-slate-300">Play sound</label>
                    <select
                        value={selectedSound}
                        onChange={handleSelectedSoundChange}
                        className="text-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-0.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                        <option label={'Notification'} value={notificationSound} />
                        <option label={'Fate Start'} value={fateSound} />
                        <option label={'Win lot'} value={winLotSound} />
                        <option label={'Feature Unlocked'} value={featureUnlockedSound} />
                        <option label={'Linkshell Transmission'} value={linkshellSound} />
                        <option label={'Error'} value={errorSound} />
                    </select>
                    <button className="p-1 max-w-5 max-h-5 rounded-full bg-lime-500 text-green-50" onClick={playSelectedSound}>
                        <svg className={'w-full'} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                fillRule="evenodd"
                                d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>
            </OptionSection>

            <OptionSection>
                <div className={'flex items-center gap-4 mb-2'}>
                    <Toggle checked={isNotificationEnabled} onChange={handleNotificationActivationChange} />
                    <h3 className={'font-semibold text-lg'}>Notifications</h3>
                </div>
                <label className="text-sm text-gray-500 dark:text-slate-300">Send notification for reminder / event start</label>
            </OptionSection>

            <OptionSection>
                <div className={' flex items-center gap-4 mb-2'}>
                    <Toggle checked={isReminderEnabled} onChange={handleReminderActivationChange} />
                    <h3 className={'font-semibold text-lg'}>Reminder</h3>
                </div>
                <div>
                    <div className={'flex items-center gap-2 '}>
                        <label htmlFor="number-input" className="text-sm ">
                            Remind me
                        </label>
                        <input
                            type="number"
                            id="number-input"
                            onChange={handleReminderTimeChange}
                            value={remindInMinutes ?? 0}
                            min={0}
                            max={19}
                            step={1}
                            className="max-w-12 text-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-0.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                        <label htmlFor="number-input" className="text-sm">
                            minute(s) before
                        </label>
                    </div>
                </div>
            </OptionSection>
            <a
                className={'mt-12 text-sm text-center block text-gray-400 hover:text-lime-600'}
                href={'https://github.com/omnisnash/ffxiv-gate-reminder'}
                target={'_blank'}
            >
                GitHub
            </a>
        </main>
    );
}

export default App;
