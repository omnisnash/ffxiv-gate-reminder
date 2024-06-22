import { useEffect, useRef, useState } from 'react';
import { useInterval } from 'usehooks-ts';

export function useTimeHook(props: { onGateStart: () => void; remindInMinutes?: number; onRemind: () => void }) {
    const [timeUntil, setTimeUntil] = useState<number>(initTime);
    const [nextGates, setNextGates] = useState<number[]>(initNextGates);

    const remindDone = useRef<boolean>(false);
    const gateDone = useRef<boolean>(false);

    useEffect(() => {
        remindDone.current = !!props.remindInMinutes && props.remindInMinutes * 60 * 1000 > timeUntil;
        console.log(remindDone.current);
    }, [props.remindInMinutes]);

    useInterval(() => {
        if (props.remindInMinutes && !remindDone.current && timeUntil - props.remindInMinutes * 60 * 1000 <= 0) {
            props.onRemind();
            remindDone.current = true;
        }

        if (gateDone.current) {
            return;
        }

        if (timeUntil - 3000 <= 0) {
            gateDone.current = true;
            props.onGateStart();
            console.log('oooo');

            setTimeUntil(initTime(new Date(nextGates[1])));
            setNextGates(initNextGates(new Date(nextGates[0])));
            remindDone.current = false;
            gateDone.current = false;
        } else {
            const nextGate = new Date(nextGates[0]);
            setTimeUntil(nextGate.getTime() - new Date().getTime());
        }
    }, 1000);

    return { timeUntil: timeUntil, nextGates };
}

function initTime(nextGate = getNextGate()): number {
    return nextGate.getTime() - new Date().getTime();
}

function initNextGates(nextGate: Date | undefined = undefined): number[] {
    const gates: number[] = [];

    let previous: Date | undefined = nextGate;
    do {
        previous = getNextGate(previous);
        gates.push(previous.getTime());
    } while (gates.length < 3);

    return gates;
}

function getNextGate(date = new Date()): Date {
    const nextGate = new Date();
    nextGate.setSeconds(0);
    nextGate.setMilliseconds(0);
    nextGate.setHours(date.getHours());

    if (date.getMinutes() >= 40) {
        nextGate.setMinutes(0);
        nextGate.setHours(date.getHours() + 1);
    } else if (date.getMinutes() >= 20) {
        nextGate.setMinutes(40);
    } else if (date.getMinutes() >= 0) {
        nextGate.setMinutes(20);
    }

    return nextGate;
}

export default useTimeHook;
