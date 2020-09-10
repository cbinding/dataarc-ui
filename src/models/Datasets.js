class Datasets {
  constructor(data) {
    this.formData = new FormData();
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.citation = data.citation;
    this.url = data.url;
    if (data.image) {
      this.formData.append('files.image', data.image, data.image.name);
    }
    if (data.source && data.source.name) {
      this.formData.append('files.source', data.source, data.source.name);
    }
    if (data.category) {
      this.category = data.category;
    }
    this.title_layout = data.title_layout;
    this.summary_layout = data.summary_layout;
    this.details_layout = data.details_layout;
    this.link_layout = data.link_layout;
    this.formData.append('data', JSON.stringify(this));
    this.createUrl = `${process.env.VUE_APP_API_URL}/datasets`;
    this.editUrl = `${process.env.VUE_APP_API_URL}/datasets/${this.id}`;
    this.routeUrl = '/contributor/datasets';
  }

  _create = async () => {
    try {
      const resp = await axios.post(this.createUrl, this.formData);
      return resp;
    } catch (err) {
      console.log(err);
    }
  };

  _update = async () => {
    try {
      console.log(this.formData);
      const resp = await axios.put(this.editUrl, this.formData);
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

// statics

Datasets.fillable = [
  'title',
  'description',
  'citation',
  'url',
  'image',
  'source',
  'category',
  'title_layout',
  'summary_layout',
  'details_layout',
  'link_layout',
  'formData',
];

Datasets.isAttributeFillable = function (attr) {
  return Datasets.fillable.indexOf(attr) > -1;
};

export default Datasets;
