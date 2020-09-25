import {
  imageMapLayer,
  basemapLayer,
} from 'esri-leaflet'
import {
  tileLayer,
} from 'leaflet'

export default {
  'Arctic DEM': imageMapLayer({
    url: 'https://elevation2.arcgis.com/arcgis/rest/services/Polar/ArcticDEM/ImageServer',
    renderingRule: { rasterFunction: 'Hillshade Elevation Tinted' },
    useCors: false,
  }),
  'ESRI Streets': basemapLayer('Streets'),
  'ESRI Topographic': basemapLayer('Topographic'),
  'ESRI Imagery': basemapLayer('ImageryClarity'),
  'Google Terrain': tileLayer('https://www.google.com/maps/vt?lyrs=p@189&gl=cn&x={x}&y={y}&z={z}', {
    attribution: 'Google',
  }),
  'Google Satellite': tileLayer('https://www.google.com/maps/vt?lyrs=s,h@189&gl=cn&x={x}&y={y}&z={z}', {
    attribution: 'Google',
  }),
  'Open Street Map': tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }),
  'Stamen Terrain': tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abcd',
    ext: 'png',
  }),
}
