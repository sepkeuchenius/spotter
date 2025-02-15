import React, { createContext, useState } from "react";

// Create two context:
// UserContext: to query the context state
// UserDispatchContext: to mutate the context state
const mapContext = createContext(undefined);

// A "provider" is used to encapsulate only the
// components that needs the state in this context
function MapProvider({ children }) {
  const [popupContent, setPopupContent] = useState([]);
  const [count, setCount] = useState(0);
  const [map, setMap] = useState(null);
  const [lngLat, setLngLat] = useState({ lng: null, lat: null });

  function click() {
    setCount(count + 1);
  }

  const Provider = mapContext.Provider;

  return (
    <Provider
      value={{
        popupContent,
        setPopupContent,
        map,
        setMap,
        lngLat,
        setLngLat,
        count,
        click
      }}
    >
      {children}
    </Provider>
  );
}

export { MapProvider, mapContext };
