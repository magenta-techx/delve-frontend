import * as React from "react";
import { SVGProps } from "react";
const SVGComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={23}
    height={19}
    viewBox="0 0 23 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.130495 8.41349C-0.0434985 9.01394 -0.0434984 9.65273 0.130495 10.2532C1.53888 15.1135 6.02328 18.6667 11.3376 18.6667C16.6519 18.6667 21.1363 15.1135 22.5447 10.2532C22.7186 9.65273 22.7186 9.01394 22.5447 8.41349C21.1363 3.5532 16.6519 0 11.3376 0C6.02328 0 1.53888 3.5532 0.130495 8.41349ZM11.34 14C13.9173 14 16.0066 11.9107 16.0066 9.33333C16.0066 6.75601 13.9173 4.66667 11.34 4.66667C8.76264 4.66667 6.6733 6.75601 6.6733 9.33333C6.6733 11.9107 8.76264 14 11.34 14Z"
      fill="currentColor"
    />
  </svg>
);
export default SVGComponent;
