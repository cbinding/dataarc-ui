class MapLayers {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.createUrl = `${process.env.VUE_APP_API_URL}/map-layers`;
    this.editUrl = `${process.env.VUE_APP_API_URL}/map-layers/${this.id}`;
    this.routeUrl = '/admin/map-layers';
  }

  _create = async () => {
    try {
      const resp = await axios.post(this.createUrl, this);
      return resp;
    } catch (err) {
      console.log(err);
    }
  };

  _update = async () => {
    try {
      const resp = await axios.put(this.editUrl, this);
      return resp;
    } catch (err) {
      console.log(err);
    }
  };

  _delete = async () => {
    try {
      const resp = await axios.delete(
        `${process.env.VUE_APP_API_URL}/map-layers/${this.id}`
      );
      return 'allMapLayers';
    } catch (err) {
      console.log(err);
    }
  };
}

export default MapLayers;
