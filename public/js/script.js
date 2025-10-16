// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

map.on('load', () => {
  map.resize();
});

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: coordinates,
  zoom: 10,
});

new mapboxgl.Marker()
  .setLngLat(coordinates)
  .addTo(map);

  // You can later add filter click handlers here
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    alert(`Filter applied: ${btn.textContent.trim()}`);
  });
});





