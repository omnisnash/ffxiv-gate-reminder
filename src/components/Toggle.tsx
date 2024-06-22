export interface ToggleProps {
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Toggle = (props: ToggleProps) => {
    return (
        <label className="inline-flex items-center cursor-pointer">
            <input checked={props.checked} onChange={props.onChange} type="checkbox" className="sr-only peer" />
            <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-lime-50-300 dark:peer-focus:ring-lime-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-lime-600"></div>
        </label>
    );
};

export default Toggle;
