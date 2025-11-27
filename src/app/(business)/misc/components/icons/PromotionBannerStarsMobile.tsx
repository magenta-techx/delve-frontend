import * as React from "react";
import { SVGProps } from "react";
const SVGComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={160}
    height={182}
    viewBox="0 0 160 182"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M135 116C135 116 139.375 104.284 139.375 96C139.375 87.7157 137.416 81 135 81C132.584 81 130.625 87.7157 130.625 96C130.625 104.284 135 116 135 116ZM135 116C135 116 146.716 111.625 155 111.625C163.284 111.625 170 113.584 170 116C170 118.416 163.284 120.375 155 120.375C146.723 120.375 135.022 116.008 135 116ZM135 116C135 116 130.625 127.716 130.625 136C130.625 144.284 132.584 151 135 151C137.416 151 139.375 144.284 139.375 136C139.375 127.723 135.008 116.022 135 116ZM135 116C135 116 123.284 120.375 115 120.375C106.716 120.375 100 118.416 100 116C100 113.584 106.716 111.625 115 111.625C123.284 111.625 135 116 135 116Z"
      fill="#FEF7C3"
    />
    <g clipPath="url(#clip0_1_4)">
      <mask
        id="mask0_1_4"
        style={{
          maskType: "luminance",
        }}
        maskUnits="userSpaceOnUse"
        x={0}
        y={111}
        width={72}
        height={72}
      >
        <path d="M72 111H0V183H72V111Z" fill="white" />
      </mask>
      <g mask="url(#mask0_1_4)">
        <path
          d="M36 183C34.9577 148.894 34.1057 148.048 0 147C34.1057 145.958 34.9525 145.106 36 111C37.0422 145.106 37.8943 145.953 72 147C37.8943 148.048 37.0476 148.884 36 183Z"
          fill="#FDE272"
        />
      </g>
    </g>
    <path
      d="M99 59C97.9577 24.8943 97.1057 24.0476 63 23C97.1057 21.9577 97.9525 21.1057 99 -13C100.042 21.1057 100.894 21.9525 135 23C100.894 24.0476 100.048 24.8839 99 59Z"
      fill="#FDE272"
    />
    <defs>
      <clipPath id="clip0_1_4">
        <rect
          width={72}
          height={72}
          fill="white"
          transform="translate(0 111)"
        />
      </clipPath>
    </defs>
  </svg>
);
export default SVGComponent;
