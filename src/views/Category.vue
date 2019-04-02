<template>
  <div>
    <Navbar></Navbar>
    <b-container class="category-container">
      <h4>Category List</h4>
      <button class="btn btn-primary" @click="handleAdd()">Create Category</button>
      <b-table
        :items="data"
        :fields="fields"
        :tbody-tr-class="rowClass"
        :per-page="perPage"
        :current-page="currentPage"
        :busy="isBusy"
      >
        <div slot="table-busy" class="text-center text-success my-2">
          <b-spinner class="align-middle"></b-spinner>&nbsp;
          <strong>Loading...</strong>
        </div>
        <template slot="image" slot-scope="data">
          <img class="category-image" :src="data.item.image.url">
        </template>
        <template slot="action" slot-scope="data">
          <button class="btn btn-primary btn-sm" @click="handleEdit(data.item)">Edit</button>
          <button class="btn-delete btn btn-danger btn-sm" @click="handleDelete(data.item)">Delete</button>
        </template>
      </b-table>
      <b-pagination
        v-model="currentPage"
        :total-rows="total_pages"
        :per-page="perPage"
        aria-controls="my-table"
      ></b-pagination>
    </b-container>

    <b-modal v-model="modalShow" :title="title">
      <b-form enctype="multipart/form-data" @submit.prevent="onSubmit">
        <b-form-group label="Name:" label-for="name">
          <b-form-input id="name" v-model="form.name" type="text" required placeholder="Enter name"></b-form-input>
        </b-form-group>

        <b-form-group>
          <b-form-checkbox-group v-model="form.enable" id="enable">
            <b-form-checkbox
              v-model="form.enable"
              name="enable"
              value="true"
              unchecked-value="false"
            >Enable</b-form-checkbox>
          </b-form-checkbox-group>
        </b-form-group>

      <b-form-group>
        <b-form-file
          v-model="form.image"
          placeholder="Choose a file image"
          drop-placeholder="Drop file image here"
        ></b-form-file>
      </b-form-group>

        <b-button type="submit" variant="primary">
          <b-spinner v-if="isSubmit" small label="Spinning"></b-spinner>
          <div v-else>
            <span v-if="isEdit">Update</span>
            <span v-else>Submit</span>
          </div>
        </b-button>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import axios from "axios";
import Navbar from "@/components/nav/Navbar";

export default {
  data() {
    return {
      isBusy: true,
      modalShow: false,
      isEdit: false,
      isSubmit: false,
      title: "",
      idData: "",
      form: {
        name: "",
        enable: "",
        image: ""
      },
      perPage: 0,
      currentPage: 1,
      total_pages: 0,
      fields: [
        "name",
        "enable",
        {
          key: "image",
          label: "Image"
        },
        "created_at",
        "updated_at",
        {
          key: "action",
          label: "Action"
        }
      ],
      data: []
    };
  },
  mounted() {
    axios
      .get("http://pretest-qa.privydev.id/api/v1/category")
      .then(response => {
        this.data = response.data.data;
        this.perPage = response.data.meta.pagination.per_page;
        this.isBusy = false;
      })
      .catch(err => console.log(err));
  },
  methods: {
    rowClass(item, type) {
      if (!item) return;
      if (item.enable === true) return "table-success";
      else return "table-danger";
    },
    handleEdit(data) {
      this.isEdit = true;
      this.title = "Edit Category";
      this.idData = data.id;
      this.form.name = data.name;
      this.form.enable = data.enable;
      this.form.image = data.image;
      this.modalShow = true;
    },
    handleAdd() {
      this.isEdit = false;
      this.title = "Create Category";
      this.idData = "";
      this.form.name = "";
      this.form.enable = "";
      this.form.image = "";
      this.modalShow = true;
    },
    handleDelete(data) {
      axios({
        url: "http://pretest-qa.privydev.id/api/v1/category/" + data.id,
        method: "DELETE"
      })
        .then(response => {
          console.log(response);
        })
        .catch(err => console.log(err));
    },
    onSubmit() {
      this.isSubmit = true;
      if (this.isEdit) {
        axios
          .put(
            "http://pretest-qa.privydev.id/api/v1/category/" + this.idData,
            this.form
          )
          .then(response => {
            alert("success");
            this.isEdit = false;
            this.isSubmit = false;
            this.modalShow = false;

            axios
              .get("http://pretest-qa.privydev.id/api/v1/category")
              .then(response => {
                this.data = response.data.data;
                this.perPage = response.data.meta.pagination.per_page;
                this.total_pages = response.data.meta.pagination.total_pages;
                this.isBusy = false;
              })
              .catch(err => console.log(err));
          })
          .catch(err => {
            alert(err);
            this.isEdit = false;
            this.isSubmit = false;
            this.modalShow = false;
          });
      } else {
        if (this.form.enable[0] == true) {
          this.form.enable = true;
        } else {
          this.form.enable = false;
        }
        axios
          .post("http://pretest-qa.privydev.id/api/v1/category", this.form)
          .then(response => {
            alert("success");
            this.isSubmit = false;
            this.modalShow = false;

            axios
              .get("http://pretest-qa.privydev.id/api/v1/category")
              .then(response => {
                this.data = response.data.data;
                this.perPage = response.data.meta.pagination.per_page;
                this.total_pages = response.data.meta.pagination.total_pages;
                this.isBusy = false;
              })
              .catch(err => console.log(err));
          })
          .catch(err => {
            alert(err);
            this.isSubmit = false;
            this.modalShow = false;
          });
      }
    }
  },
  components: {
    Navbar
  }
};
</script>

<style scoped>
h4 {
  padding: 20px 5px;
}

button {
  margin-bottom: 20px;
}

.category-image {
  width: 150px;
  height: 150px;
}

.btn-delete {
  margin-left: 5px;
}
</style>