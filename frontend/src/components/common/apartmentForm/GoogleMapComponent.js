import React from "react";
import ModernMapComponent from "../../map/ModernMapComponent";

const GoogleMapComponent = ({ position, onPositionChange, apiKey }) => {
  const handlePositionChange = (newPosition) => {
    if (onPositionChange) {
      // Convert from [lng, lat] to { lat, lng } format
      onPositionChange({
        lat: newPosition[1],
        lng: newPosition[0],
      });
    }
  };

  return (
    <ModernMapComponent
      position={position ? [position[0] || position.lng || 0, position[1] || position.lat || 0] : [0, 0]}
      onPositionChange={handlePositionChange}
      apiKey={apiKey}
      zoom={14}
      showRadius={false}
      height={400}
    />
  );
};

export default GoogleMapComponent;