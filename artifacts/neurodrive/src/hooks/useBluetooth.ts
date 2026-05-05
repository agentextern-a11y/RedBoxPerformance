import { useState, useRef } from 'react';

const OBD_SERVICE_UUID = '0000fff0-0000-1000-8000-00805f9b34fb';
const OBD_CHAR_UUID = '0000fff1-0000-1000-8000-00805f9b34fb';

type BluetoothDeviceAny = any;
type BluetoothCharAny = any;

export function useBluetooth() {
  const [connected, setConnected] = useState(false);
  const [device, setDevice] = useState<BluetoothDeviceAny | null>(null);
  const characteristicRef = useRef<BluetoothCharAny | null>(null);

  const connect = async () => {
    try {
      const nav = navigator as any;
      if (!nav.bluetooth) {
        throw new Error("Web Bluetooth is not supported in this browser.");
      }

      const btDevice = await nav.bluetooth.requestDevice({
        filters: [{ namePrefix: 'VLINK' }],
        optionalServices: [OBD_SERVICE_UUID],
      });

      setDevice(btDevice);

      btDevice.addEventListener('gattserverdisconnected', () => {
        setConnected(false);
        setDevice(null);
        characteristicRef.current = null;
      });

      const server = await btDevice.gatt?.connect();
      if (!server) throw new Error("Could not connect to GATT server.");

      const service = await server.getPrimaryService(OBD_SERVICE_UUID);
      const characteristic = await service.getCharacteristic(OBD_CHAR_UUID);
      
      characteristicRef.current = characteristic;
      setConnected(true);
    } catch (error) {
      console.error("Bluetooth connection error:", error);
      throw error;
    }
  };

  const sendCommand = async (command: string) => {
    if (!characteristicRef.current) throw new Error("Not connected");
    const encoder = new TextEncoder();
    await characteristicRef.current.writeValue(encoder.encode(command + '\r'));
  };

  const readResponse = async (): Promise<string> => {
    if (!characteristicRef.current) throw new Error("Not connected");
    const value = await characteristicRef.current.readValue();
    const decoder = new TextDecoder();
    return decoder.decode(value);
  };

  return { connected, connect, sendCommand, readResponse, device };
}
