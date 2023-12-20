import React from "react";
import { createRoot } from "react-dom/client";
import App from "~/components/App/App";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { theme } from "~/theme";
import axios from "axios";
import { AppConfigurationClient } from "@azure/app-configuration";

const client = new AppConfigurationClient(import.meta.env.VITE_CONFIG_CONNECTION_STRING);

axios.interceptors.request.use(async function (config) {
  const SUBSCRIPTION_KEY = await client.getConfigurationSetting({ key: "APIM_SUBSCRIPTION_KEY" });
  config.headers = {
    ...config.headers,
    "Ocp-Apim-Subscription-Key": SUBSCRIPTION_KEY?.value as any,
    "Cache-Control": "private, max-age=100",
  };
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: false, staleTime: Infinity },
  },
});

if (import.meta.env.DEV) {
  const { worker } = await import("./mocks/browser");
  worker.start({ onUnhandledRequest: "bypass" });
}

const container = document.getElementById("app");
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
