import * as React from "react";
import { SVGProps } from "react";
const SVGComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={20}
    height={16}
    viewBox="0 0 20 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 0H16C18.2091 0 20 1.79086 20 4V12C20 14.2091 18.2091 16 16 16H4C1.79086 16 0 14.2091 0 12V4C0 1.79086 1.79086 0 4 0ZM4 10.25C3.58579 10.25 3.25 10.5858 3.25 11C3.25 11.4142 3.58579 11.75 4 11.75H5C5.41421 11.75 5.75 11.4142 5.75 11C5.75 10.5858 5.41421 10.25 5 10.25H4ZM7.25 11C7.25 10.5858 7.58579 10.25 8 10.25H9C9.41421 10.25 9.75 10.5858 9.75 11C9.75 11.4142 9.41421 11.75 9 11.75H8C7.58579 11.75 7.25 11.4142 7.25 11ZM12 10.25C11.5858 10.25 11.25 10.5858 11.25 11C11.25 11.4142 11.5858 11.75 12 11.75H16C16.4142 11.75 16.75 11.4142 16.75 11C16.75 10.5858 16.4142 10.25 16 10.25H12Z"
      fill="#5F2EEA"
    />
  </svg>
);
export default SVGComponent;
