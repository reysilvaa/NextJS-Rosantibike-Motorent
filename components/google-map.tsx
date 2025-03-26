"use client"

import { useEffect, useRef } from "react"
import { Loader } from "@googlemaps/js-api-loader"

export default function GoogleMapComponent() {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // In a real application, you would use an environment variable for the API key
    const apiKey = "YOUR_GOOGLE_MAPS_API_KEY"

    const mapOptions = {
      center: { lat: 34.0522, lng: -118.2437 }, // Los Angeles coordinates
      zoom: 14,
      styles: [
        { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
        {
          featureType: "administrative.locality",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "poi",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "poi.park",
          elementType: "geometry",
          stylers: [{ color: "#263c3f" }],
        },
        {
          featureType: "poi.park",
          elementType: "labels.text.fill",
          stylers: [{ color: "#6b9a76" }],
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ color: "#38414e" }],
        },
        {
          featureType: "road",
          elementType: "geometry.stroke",
          stylers: [{ color: "#212a37" }],
        },
        {
          featureType: "road",
          elementType: "labels.text.fill",
          stylers: [{ color: "#9ca5b3" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry",
          stylers: [{ color: "#746855" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.stroke",
          stylers: [{ color: "#1f2835" }],
        },
        {
          featureType: "road.highway",
          elementType: "labels.text.fill",
          stylers: [{ color: "#f3d19c" }],
        },
        {
          featureType: "transit",
          elementType: "geometry",
          stylers: [{ color: "#2f3948" }],
        },
        {
          featureType: "transit.station",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#17263c" }],
        },
        {
          featureType: "water",
          elementType: "labels.text.fill",
          stylers: [{ color: "#515c6d" }],
        },
        {
          featureType: "water",
          elementType: "labels.text.stroke",
          stylers: [{ color: "#17263c" }],
        },
      ],
    }

    // For development purposes, we'll create a fallback map display
    if (!apiKey || apiKey === "YOUR_GOOGLE_MAPS_API_KEY") {
      if (mapRef.current) {
        mapRef.current.innerHTML = `
          <div style="height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; background-color: #242f3e; color: white; text-align: center; padding: 20px;">
            <div style="font-weight: bold; margin-bottom: 10px;">Google Maps</div>
            <div style="font-size: 12px;">Add your Google Maps API key to enable the interactive map</div>
          </div>
        `
      }
      return
    }

    const loader = new Loader({
      apiKey,
      version: "weekly",
    })

    loader.load().then(() => {
      // The google object is available globally after the API is loaded
      if (mapRef.current && window.google) {
        const map = new window.google.maps.Map(mapRef.current, mapOptions)

        // Add a marker for the business location
        new window.google.maps.Marker({
          position: mapOptions.center,
          map,
          title: "MotoCruise Rentals",
          animation: window.google.maps.Animation.DROP,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#FF5722",
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "#FFFFFF",
          },
        })
      }
    })
  }, [])

  return <div ref={mapRef} className="w-full h-full" />
}

