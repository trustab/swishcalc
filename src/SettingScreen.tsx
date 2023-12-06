import { useState } from 'react';
import { useStores } from './stores/root-store-context';
import { Observer } from 'mobx-react-lite';
import { CartItem } from './stores/settings-store';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, List, ListItem, ListItemText, Stack, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const SettingScreen: React.FC = () => {
  const { settingsStore } = useStores();
  const [newItemName, setNewItemName] = useState<string>("");
  const [newItemPriceString, setNewItemPriceString] = useState<string>("");
  const [newItemPrice, setNewItemPrice] = useState<number | null>(null);
  const [newItemNameError, setNewItemNameError] = useState<string | null>(null);
  const [newItemPriceError, setNewItemPriceError] = useState<string | null>(null);
  const  parsePrice = ():number | null => {
    var float = parseFloat(newItemPriceString.replace(',', '.'));
    if (isNaN(float)) {
      setNewItemPriceString('');
      setNewItemPrice(null);
      return null;
    }
    else {
      float = Math.round(float * 10) / 10;
      float.toFixed(2);
      setNewItemPriceString(float.toString());
      setNewItemPrice(float);
    }
    return float;
  }
  
  const removeItem = (id: string) => {
    settingsStore.removeCartItem(id);
    // after removing the item, we start animation
  };

  const addItem = (addAnother?: boolean) => {
    const parsedPrice = parsePrice();
    if (newItemName.length == 0 || parsedPrice == null) {
      if (newItemName.length == 0) {
        setNewItemNameError('Namn måste anges');
      }
      else {
        setNewItemNameError(null);
      }
      if (parsedPrice == null) {
        setNewItemPriceError('Pris måste anges');
      }
      else {
        setNewItemPriceError(null);
      }
      return;
    }
    settingsStore.addCartItem(newItemName, parsedPrice);
    // after removing the item, we start animation
    if (!addAnother) {
      settingsStore.setAddItemModalVisible(false);
    }else{
      setNewItemName("");
      setNewItemPriceString("");
      setNewItemPrice(null);
      setNewItemNameError(null);
      setNewItemPriceError(null);
    }
  }

  const showAddItemModal = () => {
    setNewItemName("");
    setNewItemPriceString("");
    setNewItemPrice(null);
    setNewItemNameError(null);
    setNewItemPriceError(null);
    settingsStore.setAddItemModalVisible(true);
  }

  // function renderItem(info: DragListRenderItemInfo<CartItem>,) {
  //   const { item, onDragStart, onDragEnd, isActive } = info;

  //   return (
  //     <List.Item
  //       key={item.id}
  //       title={item.name}
  //       style={{ borderBottomColor: theme.colors.onSurface, borderBottomWidth: .5, backgroundColor: isActive ? theme.colors.scrim : theme.colors.background}}
  //       description={item.price.toString() + ' kr'}
  //       right={props => {
  //         return (<>
  //           <IconButton onPress={() => removeItem(item.id)} {...props} icon="delete" />
  //           <IconButton onPressIn={onDragStart} onPressOut={onDragEnd} {...props} icon="cog" />
  //         </>)
  //       }
  //       }

  //     />
  //   );
  // }
  async function onReordered(fromIndex: number, toIndex: number) {
    const copy = [...settingsStore.cartItems]; // Don't modify react data in-place
    const removed = copy.splice(fromIndex, 1);

    copy.splice(toIndex, 0, removed[0]); // Now insert at the new pos
    settingsStore.setCartItems(copy);
  }
  return (
    <Observer>
      {() => (

<Stack gap={2} style={{  maxHeight:'100%' }}>
    <TextField
            label="Telefonnummer"
            value={settingsStore.phoneNumber}
            onChange={(e:React.ChangeEvent<HTMLInputElement>) => settingsStore.setPhoneNumber(e.target.value)} />
          <TextField
            label="Meddelande"
            value={settingsStore.message}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => settingsStore.setMessage(e.target.value)} />
       <List style={{overflowY:'scroll'}} >
                 {settingsStore.cartItems.map((item: CartItem) => (
                <div 
                key={item.id}
                >
                <Divider/>
                <ListItem
                  secondaryAction={
                    <IconButton aria-label="comment" onClick={() => removeItem(item.id)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                  // description={item.price.toString() + ' kr'}
                  // right={props => {
                  //   return (<>
                  //     <IconButton onPress={() => removeItem(item.id)} {...props} icon="delete" />
                  //     <IconButton onPressIn={onDragStart} onPressOut={onDragEnd} {...props} icon="cog" />
                  //   </>)
                  // }
                  // }

                >
                <ListItemText primary={item.name} secondary={`${item.price} kr`} />
                </ListItem>
                </div>
              ))}
            </List>
          {/* <DragList
            style={{ flex: 0 }}
            data={settingsStore.cartItems}
            keyExtractor={(item: CartItem) => `draggable-item-${item.id}`}
            onReordered={onReordered}
            renderItem={renderItem}
          /> */}
          
          <Button color='inherit'
            variant="contained"
            
            onClick={() => {
              showAddItemModal();
            }}
          >Lägg till vara</Button>
          <Button color='inherit'
            variant="contained"
            onClick={() => {
              settingsStore.setCartItems([]);
            }}
          >Rensa</Button>
            
            <Dialog open={settingsStore.addItemModalVisible} onClose={() => settingsStore.setAddItemModalVisible(false)}>
              <DialogTitle>Lägg till vara</DialogTitle>
              <DialogContent>
                <Stack style={{ flexDirection: 'column', justifyContent: 'space-between', gap:20, paddingTop:20 }}>
                <TextField
                  label="Namn"
                  value={newItemName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewItemName(e.target.value)}
                  helperText={newItemNameError}
                  error={newItemNameError != null}
                  />
                  
                <TextField
                  type='number'
                  label="Pris"
                  value={newItemPriceString.toString()}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => setNewItemPriceString(event.target.value)}
                  onBlur={() => parsePrice()}
                  error={newItemPriceError != null}
                  helperText={newItemPriceError}
                   />
                </Stack>
              </DialogContent>
              <DialogActions>
                <Button color='inherit' onClick={() => settingsStore.setAddItemModalVisible(false)}>Stäng</Button>
                <Button color='inherit' onClick={() => { addItem() }}>Spara</Button>
                <Button color='inherit' onClick={() => { addItem(true) }}>Spara & lägg till ny</Button>
              </DialogActions>
            </Dialog>
        </Stack>
      )}
    </Observer>
  );
}

export default SettingScreen;

