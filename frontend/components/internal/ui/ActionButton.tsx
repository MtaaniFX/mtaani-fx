import { ReactElement, ReactNode} from 'react';

function ActionButton({children, icon}: { children: ReactNode, icon?: ReactElement }) {
    let IconElement;
    if (icon) {
        // group-hover:last:ml-4
        IconElement = (
            <span className="p-2 ml-3 bg-primary-foreground rounded-full text-foreground">{icon}</span>
        )
    }

    return (
        <button
            className="group p-1 pl-4 flex items-center justify-center
            text-primary-foreground bg-primary shadow-md hover:shadow-lg
            transition-transform duration-300 ease-in-out transform hover:scale-110
            rounded-full ">
            <span>{children}</span>
            {IconElement}
        </button>
    )
}

export default ActionButton;
