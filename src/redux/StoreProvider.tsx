"use client";

import { useState } from "react";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { makeStore } from "./store";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [store] = useState(makeStore);

  return (
    <Provider store={store}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: "12px",
            border: "1px solid #fee2e2",
            color: "#1f2937",
          },
          success: {
            iconTheme: {
              primary: "#16a34a",
              secondary: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#CC0000",
              secondary: "#ffffff",
            },
          },
        }}
      />
    </Provider>
  );
}
