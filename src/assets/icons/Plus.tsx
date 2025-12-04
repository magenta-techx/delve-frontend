import * as React from "react";
import { SVGProps } from "react";
const SVGComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={9}
    height={9}
    viewBox="0 0 9 9"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4.2 1L4.2 7.4M7.4 4.2L1 4.2"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    />
  </svg>
);
export default SVGComponent;
