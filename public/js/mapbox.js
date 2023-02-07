export const getMapbox = (locations) => {
    mapboxgl.accessToken = 'pk.eyJ1IjoibWVodWw3IiwiYSI6ImNsYnFla3ZsNjA2NHAzcG50OG4zdHoxZ2gifQ.SIMmLjbrRRsKBp6s69GlrA';

    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/outdoors-v11',
        scrollZoom: false
    });

    const bounds = new mapboxgl.LngLatBounds();

    locations.forEach(loc => {
        // create marker
        const el = document.createElement('div');
        el.className = 'marker';

        // add marker
        new mapboxgl
            .Marker({
                element: el,
                anchor: 'bottom'
            })
            .setLngLat(loc.coordinates)
            .addTo(map)

        // add popup
        new mapboxgl
            .Popup({
                offset: 20
            })
            .setLngLat(loc.coordinates)
            .setHTML(`<p>Day ${loc.day} : ${loc.description}`)
            .addTo(map)

        // extend bound to include current location
        bounds.extend(loc.coordinates)
    })

    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 100,
            left: 150,
            right: 150
        }
    })
}