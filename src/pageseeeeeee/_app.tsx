import React, { useMemo } from 'react';
import type { AppProps } from 'next/app';
import axios, { AxiosContext } from "@/services/api/request";
import RenderRouter from "@/routes/RenderRouter";
import { CustomChakraProvider } from "@/components/ui/provider";
import { AuthProvider } from "@/hooks/useAuth";

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

// ✅ Ajout pour les DatePickers :
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const muiTheme = createTheme();

const AxiosProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const axiosValue = useMemo(() => axios, []);
  return <AxiosContext.Provider value={axiosValue}>{children}</AxiosContext.Provider>;
};

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CustomChakraProvider>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDayjs}> 
          <AxiosProvider>
            <AuthProvider>
              <RenderRouter>
                <Component {...pageProps} />
              </RenderRouter>
            </AuthProvider>
          </AxiosProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </CustomChakraProvider>
  );
}
