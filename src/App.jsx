import React, { useEffect, useState } from 'react';
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import { MapPin, Phone, Clock, Star, Navigation, Info, Timer } from "lucide-react";
import './App.css';

const App = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [distanceInfo, setDistanceInfo] = useState(null);

  const FARMACIA_COORDS = {
    lat: -28.353304,
    lng: -59.263077
  };

  const FARMACIA_INFO = {
    rating: 4.7,
    reviews: 7,
    phone: '348245133'
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.error("Error obteniendo ubicación:", error)
      );
    }
  }, []);

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (!window.google) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDYQ1nxoBTx4y59f0Hx-TUspQo05-HvfKU&libraries=places,geometry`;
        script.async = true;
        script.defer = true;

        script.onload = () => {
          initMap();
          if (userLocation) {
            calculateDistance();
          }
        };

        document.head.appendChild(script);
      } else {
        initMap();
        if (userLocation) {
          calculateDistance();
        }
      }
    };

    loadGoogleMaps();

    return () => {
      const scripts = document.querySelectorAll('script[src*="maps.googleapis"]');
      scripts.forEach(script => script.remove());
    };
  }, [userLocation]);

  const calculateDistance = () => {
    if (!window.google || !userLocation) return;

    const service = new window.google.maps.DistanceMatrixService();

    service.getDistanceMatrix({
      origins: [{ lat: userLocation.lat, lng: userLocation.lng }],
      destinations: [FARMACIA_COORDS],
      travelMode: window.google.maps.TravelMode.DRIVING,
      unitSystem: window.google.maps.UnitSystem.METRIC
    }, (response, status) => {
      if (status === 'OK' && response.rows[0].elements[0].status === 'OK') {
        const result = response.rows[0].elements[0];
        setDistanceInfo({
          distance: result.distance.text,
          duration: result.duration.text
        });
      }
    });
  };

  const initMap = () => {
    if (!document.getElementById('map')) return;

    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: FARMACIA_COORDS,
      zoom: 17,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "on" }]
        }
      ]
    });

    const pinImage = {
      url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
      size: new window.google.maps.Size(32, 32),
      origin: new window.google.maps.Point(0, 0),
      anchor: new window.google.maps.Point(16, 32),
      scaledSize: new window.google.maps.Size(32, 32)
    };

    const marker = new window.google.maps.Marker({
      position: FARMACIA_COORDS,
      map: map,
      title: 'Farmacia SNAIDER',
      animation: window.google.maps.Animation.DROP,
      icon: pinImage
    });

    const contentString = `
      <div class="custom-info-window">
        <h3>Farmacia SNAIDER</h3>
        <p class="address">Calle 21 50, Las Toscas</p>
        <div class="rating">
          <span class="stars">★★★★★</span>
          <span class="rating-text">${FARMACIA_INFO.rating} (${FARMACIA_INFO.reviews} reseñas)</span>
        </div>
      </div>
    `.trim();

    const infoWindow = new window.google.maps.InfoWindow({
      content: contentString,
      ariaLabel: "Farmacia SNAIDER",
    });

    marker.addListener("click", () => {
      infoWindow.open(map, marker);
    });

    infoWindow.open(map, marker);
  };

  const handleLocationRequest = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(userPos);
          window.open(
            `https://www.google.com/maps/dir/${userPos.lat},${userPos.lng}/${FARMACIA_COORDS.lat},${FARMACIA_COORDS.lng}`,
            '_blank'
          );
        },
        (error) => {
          console.error("Error obteniendo ubicación:", error);
          window.open(`https://www.google.com/maps/dir/?api=1&destination=${FARMACIA_COORDS.lat},${FARMACIA_COORDS.lng}`, '_blank');
        }
      );
    } else {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${FARMACIA_COORDS.lat},${FARMACIA_COORDS.lng}`, '_blank');
    }
  };

  const getDates = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    return {
      today: today.toLocaleDateString('es-AR', {
        weekday: 'long'
      }),
      tomorrow: tomorrow.toLocaleDateString('es-AR', {
        weekday: 'long'
      })
    };
  };

  const { today, tomorrow } = getDates();

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: 'url("/fondo.jpg")',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        backgroundBlend: 'overlay'
      }}
    >
      <div className="min-h-screen bg-white/60 backdrop-blur-sm">
        <main className="container mx-auto px-4 py-4 max-w-4xl">
          {/* Header con "DE TURNO:" */}
          <div className="text-center mb-6 p-4 rounded-3xl bg-white/90 backdrop-blur-sm shadow-lg transform hover:scale-105 transition-all duration-300">
            <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-emerald-600 to-green-400 text-transparent bg-clip-text">
              DE TURNO:
            </h1>
          </div>

          {/* Pharmacy Card */}
          <Card className="overflow-hidden bg-white/90 backdrop-blur-sm shadow-xl mb-6 hover:shadow-2xl transition-all duration-300 rounded-3xl">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="text-center">
                  <h2 className="text-4xl font-black mb-2 tracking-tight leading-tight">
                    <span className="text-gray-800">Farmacia</span>{' '}
                    <span className="pharmacy-name text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-500 relative inline-block">
                      SNAIDER
                      <div className="glow-effect"></div>
                    </span>
                  </h2>
                  <p className="text-lg text-gray-600 mb-2">Calle 21 50</p>
                  <div className="rating-container flex items-center justify-center gap-2 text-yellow-500">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-700 font-medium">
                      {FARMACIA_INFO.rating} ({FARMACIA_INFO.reviews} reseñas)
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 max-w-md mx-auto">
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      className="rounded-full transform hover:scale-105 active:scale-95 transition-all duration-200 py-3 text-base font-semibold bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 shadow-lg hover:shadow-xl"
                      onClick={() => window.location.href = `tel:${FARMACIA_INFO.phone}`}
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Llamar
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-full transform hover:scale-105 active:scale-95 transition-all duration-200 py-3 text-base font-semibold border-2 hover:bg-green-50"
                      onClick={handleLocationRequest}
                    >
                      <Navigation className="mr-2 h-4 w-4" />
                      Cómo llegar
                    </Button>
                  </div>

                  {distanceInfo && (
                    <div className="bg-gray-50 rounded-2xl p-2 space-y-1">
                      <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
                        <MapPin className="h-4 w-4" />
                        <span>Distancia: {distanceInfo.distance}</span>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
                        <Timer className="h-4 w-4" />
                        <span>Tiempo estimado: {distanceInfo.duration}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center text-gray-600 bg-gray-50 p-3 rounded-2xl shadow-inner text-sm">
                  <Clock className="mr-2 h-4 w-4 flex-shrink-0 text-green-500" />
                  <span>
                    Desde las 8 AM del {today} hasta las 8 AM del {tomorrow}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alert Banner */}
          <div className="rounded-3xl bg-amber-50/80 backdrop-blur-sm p-3 text-center text-amber-800 border border-amber-200 shadow-sm animate-fade-in mb-6">
            <div className="flex items-center justify-center gap-2">
              <Info className="h-4 w-4" />
              <span className="text-sm font-medium">Las guardias son exclusivas para urgencias médicas</span>
            </div>
          </div>

          {/* Map */}
          <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-3xl">
            <CardContent className="p-0">
              <div
                id="map"
                className="w-full h-[300px] rounded-3xl"
                style={{ minHeight: '300px' }}
              ></div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default App;