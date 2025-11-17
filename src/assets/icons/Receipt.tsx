import * as React from "react";
import { SVGProps } from "react";
const SVGComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={12}
    height={14}
    viewBox="0 0 12 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3.00156 3.80156H8.60156M3.00156 7.00156H8.60156M1.64156 0.601562H9.96156C10.5359 0.601562 11.0016 1.13882 11.0016 1.80156V12.6016L9.26823 11.4016L7.5349 12.6016L5.80156 11.4016L4.06823 12.6016L2.3349 11.4016L0.601562 12.6016V1.80156C0.601562 1.13882 1.06719 0.601562 1.64156 0.601562Z"
      stroke="currentColor"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default SVGComponent;
