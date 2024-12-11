import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { commonStyles, animations } from '../styles/commonStyles';

// Mapbox CSS
import 'mapbox-gl/dist/mapbox-gl.css';

// Set Mapbox token
mapboxgl.accessToken = 'pk.eyJ1IjoieXVzc2VmMjI1NzIwIiwiYSI6ImNtNGhzdmtxdTAybXMyaXIzbWN6bmkzdGEifQ.OEX49SPCJZ5l0jnqKarxwA';

const ATMLocator = () => {
    const mapContainerRef = useRef(null);

    useEffect(() => {
        // Create map instance
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/dark-v11',
            center: [31.2357, 30.0444], // Cairo coordinates
            zoom: 12
        });

        // Add navigation controls
        map.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Sample ATM locations
        const atms = [
            {
                name: 'Crédit Agricole',
                coordinates: [31.2357, 30.0444],
                address: 'Crédit Agricole, Makram Ebed St, Nasr, Cairo 11, Egypt'
            },
            {
                name: 'Atmosphere Restaurant & Cafe',
                coordinates: [31.2400, 30.0500],
                address: 'Atmosphere Restaurant & Cafe, 36 El Zaher St, Cairo, Cairo 11, Egypt'
            },
            {
                name: 'QNB AlAhli بنك قطر الوطني الأهلي',
                coordinates: [31.2300, 30.0400],
                address: 'QNB AlAhli بنك قطر الوطني الأهلي, Lebanon St, Al Agouza, Giza 12, Egypt'
            }
        ];

        // Add markers for ATMs
        atms.forEach(atm => {
            const marker = document.createElement('div');
            marker.className = 'marker';

            new mapboxgl.Marker(marker)
                .setLngLat(atm.coordinates)
                .setPopup(
                    new mapboxgl.Popup({ offset: 25 })
                        .setHTML(
                            `<h3 style="color: #000; margin: 0 0 5px 0;">${atm.name}</h3>
                            <p style="color: #666; margin: 0;">${atm.address}</p>`
                        )
                )
                .addTo(map);
        });

        return () => map.remove();
    }, []);

    return (
        <div style={commonStyles.pageContainer}>
            <div style={commonStyles.contentWrapper}>
                <div style={{
                    ...commonStyles.section,
                    textAlign: 'center',
                    marginBottom: '2rem'
                }}>
                    <h1 style={commonStyles.title}>ATM Locator</h1>
                    <p style={{
                        ...commonStyles.text,
                        fontSize: '1.2rem'
                    }}>
                        Find ATMs near you
                    </p>
                </div>
                
                <div style={{
                    ...commonStyles.section,
                    height: '500px',
                    padding: 0,
                    overflow: 'hidden'
                }}>
                    <div ref={mapContainerRef} style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '15px'
                    }} />
                </div>
                
                <div style={commonStyles.section}>
                    <h2 style={commonStyles.subtitle}>Nearby ATMs</h2>
                    <div style={commonStyles.grid}>
                        {[
                            {
                                name: 'Crédit Agricole',
                                address: 'Crédit Agricole, Makram Ebed St, Nasr, Cairo 11, Egypt'
                            },
                            {
                                name: 'Atmosphere Restaurant & Cafe',
                                address: 'Atmosphere Restaurant & Cafe, 36 El Zaher St, Cairo, Cairo 11, Egypt'
                            },
                            {
                                name: 'QNB AlAhli بنك قطر الوطني الأهلي',
                                address: 'QNB AlAhli بنك قطر الوطني الأهلي, Lebanon St, Al Agouza, Giza 12, Egypt'
                            }
                        ].map((atm, index) => (
                            <div 
                                key={index}
                                style={commonStyles.card}
                            >
                                <h3 style={{
                                    ...commonStyles.subtitle,
                                    color: '#d4af37',
                                    marginBottom: '0.5rem',
                                    fontSize: '1.2rem'
                                }}>
                                    {atm.name}
                                </h3>
                                <p style={commonStyles.text}>
                                    {atm.address}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <style>
                {animations}
                {`
                    .marker {
                        background-color: #d4af37;
                        width: 20px;
                        height: 20px;
                        border-radius: 50%;
                        cursor: pointer;
                        border: 2px solid #fff;
                        box-shadow: 0 0 10px rgba(0,0,0,0.3);
                    }
                `}
            </style>
        </div>
    );
};

export default ATMLocator; 