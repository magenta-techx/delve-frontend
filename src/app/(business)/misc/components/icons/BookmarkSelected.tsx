import * as React from "react";
import { SVGProps } from "react";
const SVGComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={19}
    height={21}
    viewBox="0 0 19 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M0 3.5V17.6702C0 20.272 2.29642 21.3192 4.12101 19.4643C4.64547 18.9312 5.23457 18.3251 5.89593 17.6363C7.76854 15.6858 10.8981 15.6858 12.7707 17.6363C13.4321 18.3251 14.0212 18.9312 14.5457 19.4643C16.3702 21.3192 18.6667 20.272 18.6667 17.6702V3.5C18.6667 1.567 17.0997 0 15.1667 0H3.5C1.567 0 0 1.567 0 3.5Z"
      fill="currentColor"
    />
  </svg>
);
export default SVGComponent;
