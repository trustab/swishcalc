import { useState } from 'react';
import { useStores } from './stores/root-store-context';
import { Observer } from 'mobx-react-lite';
import { CartItem } from './stores/settings-store';
import { Alert, Button, CircularProgress, Container, Dialog, DialogActions, DialogContent, Divider, IconButton, List, ListItem, ListItemText, Snackbar, Stack, Typography } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

const CalcScreen: React.FC = () => {
  // const theme = useTheme();
  const { settingsStore } = useStores();
  const [error, setError] = useState(false);
  const showQrCode = () => {
    setError(false);
    settingsStore.setQrCode(null);
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
        <Stack gap={2} style={{  maxHeight:'100%' }}>
          <List style={{overflowY:'scroll'}} >
            {settingsStore.cartItems.map((item: CartItem) => (
              <div
                key={item.id}
              >
                <Divider />
                <ListItem

                  secondaryAction={
                    <Stack direction="row" spacing={2}>
                      <Button color='inherit'
                      variant="contained"
                      size='small'
                      style={{width:30, height:30, padding:4, minWidth:0, borderRadius:15}}
                      onClick={() => { settingsStore.removeQuantity(item.id) }}
                      >
                        <RemoveIcon />
                      </Button>
                      <Typography variant='h5' >{item.quantity}</Typography>
                      <Button color='inherit'
                      variant="contained"
                        style={{width:30, height:30, padding:4, minWidth:0, borderRadius:15}}
                        onClick={() => { settingsStore.addQuantity(item.id) }}
                      >
                        <AddIcon />
                      </Button>
                    </Stack>
                  }
                > <ListItemText primary={item.name} secondary={`${item.price} kr`} /></ListItem>
              </div>
            ))
            }
          </List>
            <div>
              Totalt: {settingsStore.sum} kr
            </div>
            <Button color='inherit'
              variant="contained"
              disabled={settingsStore.sum === 0}
       
              onClick={() => {
                showQrCode();
              }}
            >Visa QR-kod</Button>
            <Button color='inherit'
              variant="contained"
              style={{ width: '100%' }}
              onClick={() => {
                settingsStore.resetQuantities();
              }}
            >Nollställ</Button>
          <Dialog maxWidth="md" open={settingsStore.modalVisible} onClose={() => settingsStore.setModalVisible(false)}>
            <DialogContent >
            <Stack alignItems='center' minWidth={250} >

              {settingsStore.qrCode ?
                <img
                style={{ width: '100%', height: 'auto' }}
                src={settingsStore.qrCode}
                /> :
                error ? <Alert severity="error">QR-kod kunde inte hämtas</Alert> : <CircularProgress style={{flex:1}} />
              }

              </Stack>

              <div style={{ textAlign: 'center', marginTop: 20 }}>Summa: {settingsStore.sum}</div>
            </DialogContent>
            <DialogActions>
              <Button color='inherit' onClick={() => settingsStore.setModalVisible(false)}>Stäng</Button>
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



