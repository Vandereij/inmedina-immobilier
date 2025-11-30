"use client";

import { getInitialsFromEmail } from "@/lib/utils";

type UserAvatarProps = {
  email?: string | null;
};

export function UserAvatar({ email }: UserAvatarProps) {
  const initials = email ? getInitialsFromEmail(email) : "?";

  return (
    <div
      className="
        flex h-9 w-9 items-center justify-center 
        rounded-full bg-accent text-xs font-semibold 
        text-white uppercase
      "
      aria-label={`User avatar${email ? ` for ${email}` : ""}`}
    >
      {initials}
    </div>
  );
}