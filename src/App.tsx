import React, { useEffect, useState } from 'react';
import Main from './Main';
import { RootStore } from './stores/root-store';
import { RootStoreProvider } from './stores/root-store-context';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Typography } from '@mui/material';


export default function App() {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });
  
  const [rootStore, setRootStore] = useState<RootStore | undefined>(undefined)
  useEffect(() => {
  
    
  if (!rootStore) {
    setRootStore(new RootStore());
    console.log("index")
  }
  return () => {
  }
}, [rootStore])
  if (!rootStore) {
    return <Typography>Laddar Index</Typography>
  }
  
  return (
    <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <RootStoreProvider value={rootStore}>
    <Main />
    </RootStoreProvider>
    </ThemeProvider>
  )
}


