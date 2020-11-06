class Datasets {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.metadata = data.metadata;
    this.citation = data.citation;
    this.url = data.url;
    this.image = data.image;
    this.source = data.source;
    if (data.category) {
      this.category = data.category;
    }
    this.title_layout = data.title_layout;
    this.summary_layout = data.summary_layout;
    this.details_layout = data.details_layout;
    this.link_layout = data.link_layout;
    this.createUrl = `${process.env.VUE_APP_API_URL}/datasets`;
    this.editUrl = `${process.env.VUE_APP_API_URL}/datasets/${this.id}`;
    this.routeUrl = '/contributor/datasets';
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
        `${process.env.VUE_APP_API_URL}/datasets/${this.id}`
      );
      return 'allDatasets';
    } catch (err) {
      console.log(err);
    }
  };
}

export default Datasets;
