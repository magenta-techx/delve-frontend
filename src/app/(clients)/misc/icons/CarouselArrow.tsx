import * as React from "react";
import { SVGProps } from "react";
const SVGComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={60}
    height={60}
    viewBox="0 0 42 54"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M32.2361 1C37.7668 8.40806 41 17.3594 41 27C41 36.6406 37.7668 45.5919 32.2361 53"
      stroke="#4B5565"
      strokeWidth={2}
      strokeLinecap="round"
    />
    <path
      d="M16.9529 17.0372L22.4383 22.5227C24.9116 24.996 24.9116 29.006 22.4383 31.4793L16.9529 36.9647C15.9555 37.9622 14.25 37.2557 14.25 35.8451V18.1568C14.25 16.7462 15.9555 16.0398 16.9529 17.0372Z"
      fill="#131316"
    />
  </svg>
);
export default SVGComponent;
