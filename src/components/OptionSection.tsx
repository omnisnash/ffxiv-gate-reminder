export interface OptionSectionProps extends React.PropsWithChildren {}

const OptionSection = (props: OptionSectionProps) => {
    return <section className={'mb-4 border border-gray-100 dark:border-slate-500 rounded-lg md:p-4 p-2'}>{props.children}</section>;
};

export default OptionSection;
