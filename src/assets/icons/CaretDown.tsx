import * as React from "react";
import { SVGProps } from "react";
const SVGComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={26}
    height={26}
    viewBox="0 0 26 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M22.2151 10.4062C22.5462 10.0751 22.5689 9.5135 22.266 9.15176C21.9631 8.79001 21.4491 8.76511 21.1181 9.09615L15.5155 14.6987C14.1338 16.0805 11.8661 16.0805 10.4843 14.6987L4.88178 9.09615C4.55073 8.76511 4.03679 8.79001 3.73385 9.15176C3.43092 9.51351 3.4537 10.0751 3.78474 10.4062L9.38729 16.0087C11.39 18.0115 14.6098 18.0115 16.6126 16.0087L22.2151 10.4062Z"
      fill="currentColor"
    />
  </svg>
);
export default SVGComponent;
