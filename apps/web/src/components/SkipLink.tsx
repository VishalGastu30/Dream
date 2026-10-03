"use client";

/**
 * SkipLink — accessible skip navigation for keyboard users.
 * Must be a Client Component because it uses onFocus/onBlur handlers.
 * See .agents/rules/50-accessibility.md — skip link is required.
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="skip-link"
      onFocus={(e) => {
        (e.currentTarget as HTMLElement).style.top = "0";
      }}
      onBlur={(e) => {
        (e.currentTarget as HTMLElement).style.top = "-100%";
      }}
    >
      Skip to main content
    </a>
  );
}
