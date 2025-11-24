import * as React from "react";
import { SVGProps } from "react";
const SVGComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={18}
    height={20}
    viewBox="0 0 18 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15 0H13C11.3431 0 10 1.34315 10 3V17C10 18.6569 11.3431 20 13 20H15C16.6569 20 18 18.6569 18 17V3C18 1.34315 16.6569 0 15 0ZM13 1.5H15C15.8284 1.5 16.5 2.17157 16.5 3V17C16.5 17.8284 15.8284 18.5 15 18.5H13C12.1716 18.5 11.5 17.8284 11.5 17V3C11.5 2.17157 12.1716 1.5 13 1.5Z"
      fill="#4B5565"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5 6H3C1.34315 6 0 7.34315 0 9V17C0 18.6569 1.34315 20 3 20H5C6.65685 20 8 18.6569 8 17V9C8 7.34315 6.65685 6 5 6ZM3 7.5H5C5.82843 7.5 6.5 8.17157 6.5 9V17C6.5 17.8284 5.82843 18.5 5 18.5H3C2.17157 18.5 1.5 17.8284 1.5 17V9C1.5 8.17157 2.17157 7.5 3 7.5Z"
      fill="#4B5565"
    />
  </svg>
);
export default SVGComponent;
