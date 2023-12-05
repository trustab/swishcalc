import { useState } from 'react';
import { useStores } from './stores/root-store-context';
import { Observer } from 'mobx-react-lite';
import SettingScreen from './SettingScreen';
import CalcScreen from './CalcScreen';
import { BottomNavigation, BottomNavigationAction, Container, Stack } from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import TuneIcon from '@mui/icons-material/Tune';

const Main: React.FC = () => {
  const { settingsStore } = useStores();
  const [width, setWidth] = useState(0);


  const [value, setValue] = useState(0);



  return (
    <Observer>
      {() => (
        <Container maxWidth="sm"  style={{height:"100vh", flex:1, justifyContent:"stretch"}} >
          <Stack height={"100vh"} sx={{pt:2, pb:2}} flex={1} justifySelf={"stretch"} spacing={2} direction="column" justifyContent={"space-between"} >

        {value === 0 ? <CalcScreen /> : <SettingScreen />}
        
        <BottomNavigation
          sx={{ width: '100%', position: 'fixed', bottom: 0 }}
          showLabels
          value={value}
          onChange={(_, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction label="Räknare" icon={<CalculateIcon />} />
          <BottomNavigationAction label="Inställningar" icon={<TuneIcon />} />
        </BottomNavigation>
        </Stack>
            </Container>
      )}
    </Observer>
  );
}

export default Main;

