import { supabase } from "@/supabase/supabase";
import { AuthStore } from "@/utils/types";
import { create } from "zustand";
import { DecodedPoint } from "@/utils/types";

export const useAuthStore = create<AuthStore>((set, get) => ({
  isLoggedIn: false,
  isLoading: false,
  user: null,
  polyline: null,
  error: null,
  session: null,

  setPolyline: (polyline: any) => set(polyline),

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        set({ error: error });
        console.log(error);
        return;
      }

      console.log("user data");
      console.log(data);

      set({ user: data.user, isLoading: false, isLoggedIn: true });
    } catch (error) {
      set({ isLoading: false });
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Login failed");
      }
    }
  },

  signUp: async (name: string, email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        set({ error: error });
        return;
      }

      console.log("user data");
      console.log(data);

      set({ user: data.user, isLoading: false, isLoggedIn: !!data.session });
    } catch (error) {
      set({ isLoading: false });
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Signup failed");
      }
    }
  },

  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        set({ error: error });
      }

      set({ user: null, isLoggedIn: false });
    } catch (error) {
      console.log(error);
    }
  },

  initialize: async () => {
    set({ isLoading: true, error: null });
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      set({
        session: session,
        user: session ? session.user : null,
        isLoading: false,
      });
    } catch (error) {
      console.log(error);
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      set({
        session,
        user: session ? session.user : null,
        isLoading: false,
      });
    });

    return () => subscription.unsubscribe();
  },
}));
