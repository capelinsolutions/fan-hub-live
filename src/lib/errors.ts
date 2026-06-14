export function friendlyAuthError(message: string | undefined | null): string {
  if (!message) return "Something went wrong. Please try again.";
  const m = message.toLowerCase();
  if (m.includes("invalid login")) return "Invalid email or password.";
  if (m.includes("email") && m.includes("registered")) return "Email is already registered.";
  if (m.includes("user already registered")) return "Email is already registered.";
  if (m.includes("password")) return "Password is too short. Use at least 6 characters.";
  if (m.includes("email")) return "Please enter a valid email.";
  if (m.includes("network") || m.includes("fetch")) return "Network issue. Check your connection.";
  return "Something went wrong. Please try again.";
}

export function friendlyError(message: string | undefined | null): string {
  if (!message) return "Something went wrong. Please try again.";
  const m = message.toLowerCase();
  if (m.includes("network") || m.includes("fetch")) return "Network issue. Check your connection.";
  return "Something went wrong. Please try again.";
}
