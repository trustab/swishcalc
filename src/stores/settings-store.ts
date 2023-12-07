import axios from "axios";
import { makeAutoObservable } from "mobx";
import { v4 } from 'uuid';

interface QrRequest { 
  format?: string;
  payee: {
    value: string;
    editable?: boolean;
  };
  amount?: {
    value: number;
    editable?: boolean;
  };
  message?: {
    value: string;
    editable?: boolean;
  };
  size?: number;
  border?: number;
}

export interface CartItem {
  name: string;
  price: number;
  quantity: number;
  id: string;
}

export class SettingsStore {
  screen: "SETTINGS" | "CALCULATOR" = "SETTINGS";
  modalVisible: boolean = false;
  addItemModalVisible: boolean = false;
  phoneNumber: string = '';
  sum: number = 0;
  message: string = '';
  qrCode: string|null = '';
  cartItems: CartItem[] = [
     ];
  constructor() {
    makeAutoObservable(this);
    this.getDataFromDisk();
    console.log('SettingsStore constructor');
  }
  setPhoneNumber(phoneNumber: string) {
    this.phoneNumber = phoneNumber;
    this.saveDataToDisk();
  }

  setSum(sum: number) {
    this.sum = sum;
    this.saveDataToDisk();
  }


  setMessage(message: string) {
    this.message = message;
    this.saveDataToDisk();
  }

  setQrCode(qrCode: string|null) {
    this.qrCode = qrCode;
  }

  setModalVisible(visible: boolean) {
    this.modalVisible = visible;
  }

  setAddItemModalVisible(visible: boolean) {
    this.addItemModalVisible = visible;
  }

  setScreen(screen: "SETTINGS" | "CALCULATOR") {
    this.screen = screen;
  }

  addCartItem(name: string, price: number) {
    var copy = [...this.cartItems];
    copy.push({ name: name, price: price, quantity: 0, id: v4() });
    this.cartItems = copy;
    this.saveDataToDisk();
  }
 

  removeCartItem(id: string) {
    
    var removed = this.cartItems.filter(item => item.id !== id);
    this.cartItems = removed;
    this.saveDataToDisk();
   }

   setCartItems(cartItems: CartItem[]) {
    this.cartItems = cartItems;
   }

   addQuantity(id: string) {
    var copy = [...this.cartItems];
    var index = copy.findIndex(item => item.id === id);
    copy[index].quantity++;
    this.cartItems = copy;
    this.sum = this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);  
  }

  removeQuantity(id: string) {
      var copy = [...this.cartItems];
      var index = copy.findIndex(item => item.id === id);
      if (copy[index].quantity > 0) {
        copy[index].quantity--;
        this.cartItems = copy;
      }
      this.sum = this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);  
    }

    resetQuantities() {
      var copy = [...this.cartItems];
      copy.forEach(item => item.quantity = 0);
      this.cartItems = copy;
      this.sum = 0;
    }
  
  async getQrCode(): Promise<void> {
    try {
      const body:QrRequest = {
        format: "png",
        size: 300,
        payee: {
          value: this.phoneNumber,
          editable: false
        },
        amount: {
          value: this.sum,
          editable: false
        },
        message: {
          value: this.message,
          editable: false
        }

      };
      console.log(JSON.stringify(body));

      // axios.post('http://localhost:8088',body, {
      //   headers: {
      //     'Content-Type': 'application/json',
          

      //   },

      // })
      // .then(function (response) {
      //   console.log(response);
      // })
      // .catch(function (error) {
      //   console.log(error);
      // });

      const response = await fetch('https://mpc.getswish.net/qrg-swish/api/v1/prefilled', {
        method: 'POST',
        
        headers: {
          'Content-Type': 'application/json',
          'forward-to-url':'https://mpc.getswish.net/qrg-swish/api/v1/prefilled'
        },
        // mode: 'no-cors',
        // referrerPolicy: 'no-referrer',
        // mode: 'no-cors', // 'cors' by default
        body: JSON.stringify(body)
      });
      if (response.ok === false) {
        const data = await response.json();
        console.log('getQrCode error', data);
        throw new Error(data.message);
      }else{
        const blob = await response.blob();
        const fileReaderInstance = new FileReader();
        fileReaderInstance.readAsDataURL(blob);
        fileReaderInstance.onload = () => {
            var base64 = fileReaderInstance.result;
            this.setQrCode(base64 as string);
           
        }
      }
      // this.setQrCodeUrl(data.qrCodeUrl);
    } catch (error) {
      console.log('getQrCode error', error);
      throw error;
    }
  }
  async saveDataToDisk(): Promise<void> {
    try {
      const data = {
        phoneNumber: this.phoneNumber,
        sum: this.sum,
        message: this.message,
        cartItems: Array.from(this.cartItems)
      };
      console.log(JSON.stringify(data))
      localStorage.setItem('data', JSON.stringify(data));
    } catch (error) {
      console.log('saveDataToDisk error', error);
    }
  }

  async getDataFromDisk(): Promise<void> {
    try {
      const data = localStorage.getItem('data');
      console.log(data)
      if (data) {
        const parsedData = JSON.parse(data);
        this.phoneNumber = parsedData.phoneNumber;
        this.sum = parsedData.sum;
        this.message = parsedData.message;
        this.cartItems = parsedData.cartItems;
      }
    } catch (error) {
      console.log('getDataFromDisk error', error);
    }
  }

}