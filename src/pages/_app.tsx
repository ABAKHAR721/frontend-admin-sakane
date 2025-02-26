import React, { useMemo } from 'react';
import type { AppProps } from 'next/app';
import axios, { AxiosContext } from "@/services/api/request";
import RenderRouter from "@/routes/RenderRouter";
import { CustomChakraProvider } from "@/components/ui/provider";
import { AuthProvider } from "@/hooks/useAuth";

const AxiosProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const axiosValue = useMemo(() => axios, []);
  return <AxiosContext.Provider value={axiosValue}>{children}</AxiosContext.Provider>;
};

export default function MyApp({ Component, pageProps }: AppProps) {
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