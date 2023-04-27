import { useEffect, useRef } from 'react';
import { AppState, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

const useBackgroundGeolocation = ({callback}) => {
  const watchIdRef = useRef(null);

  useEffect(() => {
    const isIOS = Platform.OS === 'ios';
    let watchId = null;

    if (!isIOS) {
      watchId = Geolocation.watchPosition(
        (position) => {
          // Llama a tu función de devolución de llamada con la nueva posición
          callback(position);
        },
        (error) => console.log('Error de geolocalización:', error),
        {
          enableHighAccuracy: true,
          distanceFilter: 10,
          fastestInterval: 5000,
          interval: 10000,
          showLocationDialog: true,
        },
      );
      watchIdRef.current = watchId;
    }

    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'background' && watchIdRef.current !== null) {
        // Detiene la geolocalización en segundo plano cuando la aplicación pasa a segundo plano
        Geolocation.clearWatch(watchIdRef.current);
      } else if (nextAppState === 'active' && watchIdRef.current === null && !isIOS) {
        // Inicia la geolocalización en segundo plano cuando la aplicación se activa nuevamente
        watchId = Geolocation.watchPosition(
          (position) => {
            // Llama a tu función de devolución de llamada con la nueva posición
            callback(position);
          },
          (error) => console.log('Error de geolocalización:', error),
          {
            enableHighAccuracy: true,
            distanceFilter: 10,
            fastestInterval: 5000,
            interval: 10000,
            showLocationDialog: true,
          },
        );
        watchIdRef.current = watchId;
      }
    };

    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      // Limpia los efectos secundarios cuando el componente se desmonta
      AppState.removeEventListener('change', handleAppStateChange);
      if (watchIdRef.current !== null) {
        Geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [callback]);
};

export default useBackgroundGeolocation;