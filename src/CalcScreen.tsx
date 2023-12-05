import { useState } from 'react';
import { useStores } from './stores/root-store-context';
import { Observer } from 'mobx-react-lite';
import { CartItem } from './stores/settings-store';
import { Alert, Button, CircularProgress, Dialog, DialogActions, DialogContent, Divider, IconButton, List, ListItem, ListItemText, Snackbar, Stack, Typography } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

const CalcScreen: React.FC = () => {
  // const theme = useTheme();
  const { settingsStore } = useStores();
  const [error, setError] = useState(false);
  const showQrCode = () => {
    setError(false);
    // const win = Dimensions.get('window');
    // console.log(win);
    // setWidth(win.width - 100)
    settingsStore.setModalVisible(true);
    settingsStore.getQrCode().catch(err => {
      // setOpen(true);
      setError(true);
      // settingsStore.setModalVisible(false);
    });
    // Keyboard.dismiss();
  }
  // const handleClose = () => {
  //   setOpen(false);
  // };
  return (
    <Observer>
      {() => (
        <Stack gap={2} style={{ marginBottom: 200 }}>
          <List>
            {settingsStore.cartItems.map((item: CartItem) => (
              <div
                key={item.id}
              >
                <Divider />
                <ListItem

                  secondaryAction={
                    <Stack direction="row" spacing={2}>
                      <IconButton
                        onClick={() => { settingsStore.removeQuantity(item.id) }}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <Typography variant='h5' >{item.quantity}</Typography>
                      <IconButton
                        onClick={() => { settingsStore.addQuantity(item.id) }}
                      >
                        <AddIcon />
                      </IconButton>
                    </Stack>
                  }
                > <ListItemText primary={item.name} secondary={`${item.price} kr`} /></ListItem>
              </div>
            ))
            }
          </List>
          <Stack style={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              Totalt: {settingsStore.sum} kr
            </div>
            <Button
              variant="contained"
              disabled={settingsStore.sum === 0}
              style={{ marginBottom: 20, width: '100%' }}

              onClick={() => {
                showQrCode();
              }}
            >Visa QR-kod</Button>
            <Button
              variant="contained"
              style={{ marginBottom: 20, width: '100%' }}
              onClick={() => {
                settingsStore.resetQuantities();
              }}
            >Nollställ</Button>
          </Stack>
          <Dialog maxWidth="md" open={settingsStore.modalVisible} onClose={() => settingsStore.setModalVisible(false)}>
            <DialogContent >
              {settingsStore.qrCode ?
                <img
                  style={{ width: 'auto', height: 'auto' }}
                  src={settingsStore.qrCode}
                /> :
                error ? <Alert severity="error">QR-kod kunde inte hämtas</Alert> : <CircularProgress />
              }


              <div style={{ textAlign: 'center', marginTop: 20 }}>Summa: {settingsStore.sum}</div>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => settingsStore.setModalVisible(false)}>Stäng</Button>
            </DialogActions>
          </Dialog>
          {/* <Snackbar
            
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Note archived"
        // action={action}
        >
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          QR-kod kunde inte hämtas
        </Alert>
      </Snackbar> */}
        </Stack>
      )}
    </Observer>
  );
}

export default CalcScreen;



