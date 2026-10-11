// Layer catalogue for the DC food-access map pipeline.
// Every layer comes from Open Data DC (opendata.dc.gov, ArcGIS Hub, org "DCGIS"),
// served by the DC GIS ArcGIS REST services on maps2.dcgis.dc.gov.
// `hubId` is the Hub dataset id (<itemId>_<layerIndex>) used for metadata lookups.

export const REST_BASE = 'https://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA';
export const HUB_BASE = 'https://opendata.dc.gov';

export const LAYERS = [
  {
    key: 'grocery-stores',
    title: 'Grocery Store Locations',
    service: 'Business_Goods_and_Service_WebMercator/MapServer/4',
    hubId: '1d7c9d0e3aac49c1aa88d377a3bae430_4',
  },
  {
    key: 'low-food-access',
    title: 'Low Food Access Areas',
    service: 'Public_Service_WebMercator/MapServer/61',
    hubId: '9b4355a8e1e345ea8350b77516163dd4_61',
  },
  {
    key: 'farmers-markets',
    title: 'Farmers Market Locations',
    service: 'Business_Goods_and_Service_WebMercator/MapServer/2',
    hubId: 'f2e1c2ef9eb44f2899f4a310a80ecec9_2',
  },
  {
    key: 'healthy-corners',
    title: 'Healthy Corner Stores',
    service: 'Public_Service_WebMercator/MapServer/57',
    hubId: '9a2df4a51ce646819d0dedfecb7f466a_57',
  },
  {
    key: 'wards-2022',
    title: 'Wards from 2022',
    service: 'Administrative_Other_Boundaries_WebMercator/MapServer/53',
    hubId: 'c5cd8b40fb784548a6680aead5f919ed_53',
  },
  {
    key: 'dc-boundary',
    title: 'Washington DC Administrative Boundary',
    service: 'Administrative_Other_Boundaries_WebMercator/MapServer/10',
    hubId: '7241f6d500b44288ad983f0942b39663_10',
  },
  {
    key: 'waterbodies',
    title: 'Waterbodies',
    service: 'Environment_Water_WebMercator/MapServer/24',
    hubId: 'db65ff0038ed4270acb1435d931201cf_24',
  },
  {
    key: 'zipcodes',
    title: 'Zip Codes',
    service: 'Location_WebMercator/FeatureServer/4',
    hubId: '5637d4bb43a34668b19fe630120d2b70_4',
  },
  {
    key: 'neighborhood-labels',
    title: 'Neighborhood Labels',
    service: 'Administrative_Other_Boundaries_WebMercator/MapServer/35',
    hubId: 'c4b0cd43d50949e98e57de9f22b455fc_35',
  },
  {
    key: 'neighborhood-clusters',
    title: 'Neighborhood Clusters',
    service: 'Administrative_Other_Boundaries_WebMercator/MapServer/17',
    hubId: 'f6c703ebe2534fc3800609a07bad8f5b_17',
  },
  {
    key: 'east-of-the-river',
    title: 'East of the River',
    service: 'Administrative_Other_Boundaries_WebMercator/MapServer/56',
    hubId: 'ae515dab59184b70832746bf66e103fe_56',
  },
  {
    key: 'intersections',
    title: 'Intersection Points',
    service: 'Location_WebMercator/FeatureServer/2',
    hubId: '96a9bbbb475648769e311d03c78698a7_2',
  },
  {
    key: 'bus-stops',
    title: 'Metro Bus Stops',
    service: 'Transportation_Rail_Bus_WebMercator/MapServer/53',
    hubId: 'e85b5321a5a84ff9af56fd614dab81b3_53',
  },
];
