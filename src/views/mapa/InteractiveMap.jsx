import React, { useRef } from 'react';
import { useMapEvent } from 'react-leaflet';

function SetViewOnClick({ animateRef }) {
  const map = useMapEvent('click', (e) => {
    map.setView(e.latlng, map.getZoom(), {
      animate: animateRef.current || false
    });
  });

  return null;
}

export default function InteractiveMap() {
  const animateRef = useRef(false);

  return (
    <>
      <p>
        <label>
          <input
            type="checkbox"
            onChange={() => {
              animateRef.current = !animateRef.current;
            }}
          />
          Animate panning
        </label>
      </p>
      <SetViewOnClick animateRef={animateRef} />
    </>
  );
}
