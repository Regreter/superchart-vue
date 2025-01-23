import { SupersetClient } from '@superset-ui/core';

const token = 'IjFmNjQ2OGE0YjliY2Q2NDE5MDA2NTc0MzliNGYyZjUyMWMxNGM3MGUi.Z5GkRA.P5DptFGQFni8VFrJDz0uKp-PjZ4';

SupersetClient.configure({
  baseUrl: 'http://localhost:8088',
  headers: { Authorization: `Bearer ${token}` },
  mode: 'cors',
  credentials: 'include',
})
  .init()
  .catch((error) => console.error('Error initializing SupersetClient:', error));

export default SupersetClient;