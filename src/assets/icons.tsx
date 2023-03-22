import { SVGProps } from "react";

export const TickIcon = (
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) => (
  <svg
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    {...props}
  >
    <g
      clipPath="url(#a)"
      stroke="#3AAF86"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18.333 9.233V10a8.334 8.334 0 1 1-4.941-7.617" />
      <path d="M18.333 3.333 10 11.675l-2.5-2.5" />
    </g>
    <defs>
      <clipPath id="a">
        <rect width="20" height="20" fill="#fff" />
      </clipPath>
    </defs>
  </svg>
);
