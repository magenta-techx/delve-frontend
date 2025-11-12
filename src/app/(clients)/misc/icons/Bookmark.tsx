import * as React from "react";
import { SVGProps } from "react";
type Props = SVGProps<SVGSVGElement> & {
    strokeColor?: string
    fillColor?: string
}
const SVGComponent = (props: Props) => {
    const { strokeColor, fillColor, ...rest } = props;
    return (
        <svg
            width={25}
            height={28}
            viewBox="0 0 25 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...rest}
        >
            <path
                d="M0.5 5V23.2188C0.5 26.5641 3.45254 27.9104 5.79844 25.5256C6.47274 24.8401 7.23017 24.0609 8.08048 23.1752C10.4881 20.6675 14.5119 20.6675 16.9195 23.1752C17.7698 24.0609 18.5273 24.8401 19.2016 25.5256C21.5475 27.9104 24.5 26.5641 24.5 23.2188V5C24.5 2.51472 22.4853 0.5 20 0.5H5C2.51472 0.5 0.5 2.51472 0.5 5Z"
                fill={fillColor || "white"}
                stroke={strokeColor || "black"}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
};
export default SVGComponent;
