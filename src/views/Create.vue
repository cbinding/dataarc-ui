<template>
	<div>
		<b-container>
			<b-form class="Create" @submit.prevent="create()">
				<h3>Create *</h3>
				<b-form-group id="input-group-1" label="Type" label-for="input-1">
					<b-form-select id="input-1" v-model="form.type" :options="types" required></b-form-select>
				</b-form-group>
    <!-- Create Dataset -->
				<b-form-group v-if="form.type == 'Datasets'">
					<label>Name</label>
					<input required v-model="form.name" type="text" class="form-control form-control-lg" />
					<label>Description</label>
					<input v-model="form.description" type="text" class="form-control form-control-lg" />
					<label>Citation</label>
					<input v-model="form.citation" type="text" class="form-control form-control-lg" />
					<label>Link</label>
					<input v-model="form.link" type="text" class="form-control form-control-lg" />
					<label>Image</label>
					<b-form-file v-model="form.file" :state="Boolean(form.file)" placeholder="Choose an image or drop it here..." drop-placeholder="Drop file here..." class="form-control form-control-lg" />
					<label>Category</label>
          <b-form-select v-model="form.category" :options="category" required></b-form-select>
          <br>
          <b-button type="submit" variant="primary">Submit</b-button>
				</b-form-group>

    <!-- Create Combinator -->
				<b-form-group v-if="form.type == 'Combinators'">
					<label>Name</label>
					<input required v-model="form.name" type="text" class="form-control form-control-lg" />
					<label>Description</label>
					<input v-model="form.description" type="text" class="form-control form-control-lg" />
					<label>Citation</label>
					<input v-model="form.citation" type="text" class="form-control form-control-lg" />
          <b-button type="submit" variant="primary">Submit</b-button>
				</b-form-group>

    <!-- Create Map Layer -->
				<b-form-group v-if="form.type == 'Map Layers'">
					<label>Name</label>
					<input required v-model="form.name" type="text" class="form-control form-control-lg" />
					<label>Description</label>
					<input v-model="form.description" type="text" class="form-control form-control-lg" />
					<label>File</label>
					<b-form-file v-model="form.file" :state="Boolean(form.file)" placeholder="Choose a file or drop it here..." drop-placeholder="Drop file here..." class="form-control form-control-lg" />
          <b-button type="submit" variant="primary">Submit</b-button>
				</b-form-group>
			</b-form>
		</b-container>
	</div>
</template>

<script>
import gql from 'graphql-tag';
export default {
	data() {
		return {
      form:{
        type: "",
        name: "",
        description: "",
        citation: "",
        link: "",
        file: null,
        category: "",
      },
      types: ["Datasets", "Combinators", "Map Layers"],
      category: ["Textual", "Archaeological", "Environmental"]
		};
  },
  methods: {
    create: function(){
      var vm = this;
      let formData = new FormData();
      var url = "";
      if(this.form.type == "Map Layers"){
        url = this.$baseUrl + "/map-layers";
        formData.append('name', this.form.name);
        formData.append('description', this.form.description);
        formData.append('file', this.form.file);
      }
      else if(this.form.type == "Datasets"){
        url = this.$baseUrl + "/datasets";
        formData.append('name', this.form.name);
        formData.append('description', this.form.description);
        formData.append('citation', this.form.citation);
        formData.append('link', this.form.link);
        formData.append('image', this.form.file);
        formData.append('category', this.form.category);
      }
      else if (this.form.type == "Combinators"){
        url = this.$baseUrl + "/combinators";
        formData.append('name', this.form.name);
        formData.append('description', this.form.description);
        formData.append('citation', this.form.citation);
      }

        axios
				.post(url, formData)
				.then((response) => {
          // Handle success.
          console.log("success");
          console.log(response);
				})
				.catch((error) => {
          // Handle error.
          console.log("error")
					console.log(error);
				});
    }
  }
};
</script>
