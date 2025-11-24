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
      d="M13 0H15C16.6569 0 18 1.34315 18 3V17C18 18.6569 16.6569 20 15 20H13C11.3431 20 10 18.6569 10 17V3C10 1.34315 11.3431 0 13 0Z"
      fill="#5F2EEA"
    />
    <path
      d="M3 6H5C6.65685 6 8 7.34315 8 9V17C8 18.6569 6.65685 20 5 20H3C1.34315 20 0 18.6569 0 17V9C0 7.34315 1.34315 6 3 6Z"
      fill="#5F2EEA"
    />
  </svg>
);
export default SVGComponent;
