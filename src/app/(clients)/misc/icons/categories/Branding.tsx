import * as React from "react";
import { SVGProps } from "react";
const SVGComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={19}
    height={19}
    viewBox="0 0 19 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3.79961 14.8357H4.86628M13.3996 10.5691H16.0663C17.2445 10.5691 18.1996 11.5242 18.1996 12.7024V15.9024C18.1996 17.0806 17.2445 18.0357 16.0663 18.0357H4.86628M8.59961 4.50345L11.8786 1.22445C12.7117 0.391331 14.0625 0.391329 14.8956 1.22445L17.1583 3.48719C17.9915 4.32031 17.9915 5.67106 17.1583 6.50418L8.06628 15.5962M2.73294 18.0357H5.93294C7.11115 18.0357 8.06628 17.0806 8.06628 15.9024V3.10241C8.06628 1.9242 7.11115 0.969078 5.93294 0.969078H2.73294C1.55474 0.969078 0.599609 1.9242 0.599609 3.10241V15.9024C0.599609 17.0806 1.55474 18.0357 2.73294 18.0357Z"
      stroke="currentColor"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default SVGComponent;
