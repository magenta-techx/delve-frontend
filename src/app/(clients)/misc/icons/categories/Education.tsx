import * as React from "react";
import { SVGProps } from "react";
const SVGComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={22}
    height={20}
    viewBox="0 0 22 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.375 0C10.4775 0 9.75 0.727537 9.75 1.625V17.875C9.75 18.7725 10.4775 19.5 11.375 19.5H13.5417C14.4391 19.5 15.1667 18.7725 15.1667 17.875V1.625C15.1667 0.727537 14.4391 0 13.5417 0H11.375ZM13.5417 1.625L11.375 1.625V17.875H13.5417V1.625Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.2518 0.0557739C5.38491 -0.176507 4.49387 0.33794 4.26158 1.20482L0.0557739 16.9011C-0.176507 17.768 0.33794 18.659 1.20482 18.8913L3.29766 19.4521C4.16454 19.6844 5.05559 19.1699 5.28787 18.3031L9.49368 2.60676C9.72596 1.73988 9.21152 0.848829 8.34464 0.616549L6.2518 0.0557739ZM7.92405 2.18618L5.83121 1.6254L1.6254 17.3217L3.71824 17.8825L7.92405 2.18618Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.25 1.625C16.25 0.727537 16.9775 0 17.875 0H20.0417C20.9391 0 21.6667 0.727537 21.6667 1.625V17.875C21.6667 18.7725 20.9391 19.5 20.0417 19.5H17.875C16.9775 19.5 16.25 18.7725 16.25 17.875V1.625ZM17.875 1.625L20.0417 1.625V17.875H17.875V1.625Z"
      fill="currentColor"
    />
  </svg>
);
export default SVGComponent;
