import { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext, AuthContextType } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import type { User } from "@/types/api";

const createAuthValue = (user: User | null): AuthContextType => ({
  user,
  loading: false,
  login: async () => undefined,
  register: async () => undefined,
  logout: async () => undefined,
  refreshUser: async () => undefined,
});

export const StoryProviders = ({
  user,
  children,
  path = "/",
}: {
  user: User | null;
  children: ReactNode;
  path?: string;
}) => (
  <LanguageProvider>
    <MemoryRouter initialEntries={[path]}>
      <AuthContext.Provider value={createAuthValue(user)}>{children}</AuthContext.Provider>
    </MemoryRouter>
  </LanguageProvider>
);

