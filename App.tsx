import React, { useMemo } from 'react';
import type { AppProps } from 'next/app';
import axios, { AxiosContext } from "./src/services/api/request";
import RenderRouter from "./src/routes/RenderRouter";
import { CustomChakraProvider } from "./src/components/ui/provider";
import { AuthProvider } from "./src/hooks/useAuth";

const AxiosProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const axiosValue = useMemo(() => axios, []);

  return <AxiosContext.Provider value={axiosValue}>{children}</AxiosContext.Provider>;
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CustomChakraProvider>
      <AxiosProvider>
        <AuthProvider>
          <RenderRouter>
            <Component {...pageProps} />
          </RenderRouter>
        </AuthProvider>
      </AxiosProvider>
    </CustomChakraProvider>
  );
}
