class TopicMaps {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.citation = data.citation;
    this.url = data.url;
    this.source = data.source;
    this.createUrl = `${process.env.VUE_APP_API_URL}/topic-maps`;
    this.editUrl = `${process.env.VUE_APP_API_URL}/topic-maps/${this.id}`;
    this.routeUrl = '/admin/topic-maps';
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
        `${process.env.VUE_APP_API_URL}/topic-maps/${this.id}`
      );
      return 'allTopicMaps';
    } catch (err) {
      console.log(err);
    }
  };
}

export default TopicMaps;
