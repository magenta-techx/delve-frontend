"use client";
import * as React from "react";
import Link from "next/link";

import Logo from "@/components/ui/Logo";
import DefaultLogoIcon from "@/assets/icons/logo/DefaultLogoIcon";
import type { ButtonProps } from "@/components/ui/Button";
import LoginIcon from "@/assets/icons/auth/LoginIcon";
import SignUpIcon from "@/assets/icons/auth/SignUpIcon";

import AuthFormButton from "./AuthFormButton";
import AuthSocialLoginButtons from "./AuthFormSocialLoginButtons";


type AuthTabsShellProps = {
  active: "login" | "signup";
  children: React.ReactNode;
};

export default function AuthTabsShell({ active, children }: AuthTabsShellProps): JSX.Element {
  const buttons: Array<{
    text: string;
    href: string;
    icon: React.ReactNode;
    className: string;
    variant: ButtonProps["variant"];
  }> = [
    {
      text: "Login",
      href: "/signin",
      icon: <LoginIcon />,
      className: active === "login" ? "bg-white border-none" : "",
      variant: active === "login" ? "light" : "ghost",
    },
    {
      text: "Sign Up",
      href: "/signup",
      icon: <SignUpIcon />,
      className: active === "signup" ? "bg-white border-none" : "",
      variant: active === "signup" ? "light" : "ghost",
    },
  ];

  return (
    <section className="flex flex-col w-full items-center justify-center py-10 sm:py-0">
        <div className="flex w-full flex-col items-center">
          <div className="mb-7">
            <Logo icon={<DefaultLogoIcon />} link="/" />
          </div>
          <div className="mb-7 grid grid-cols-2 rounded-xl border border-neutral-100 bg-neutral p-[2px] text-sm">
            {buttons.map((btn, idx) => (
              <Link key={idx} href={btn.href} className="flex-1">
                <AuthFormButton
                  text={btn.text}
                  icon={btn.icon}
                  className={btn.className}
                  variant={btn.variant}
                  onClick={() => {}}
                />
              </Link>
            ))}
          </div>

          <div className="mb-8 flex w-[90vw] flex-col items-center sm:w-[525px]">{children}</div>

          <div className="mb-8 flex items-center gap-4">
            <div className="h-[1px] w-full bg-gray-300 sm:w-[185px]" />
            <div className="text-sm font-medium text-gray-600">OR</div>
            <div className="h-[1px] w-full bg-gray-300 sm:w-[185px]" />
          </div>

          <div className="w-full pb-20 sm:w-[525px]">
            <AuthSocialLoginButtons />
          </div>
        </div>
    </section>
  );
}
