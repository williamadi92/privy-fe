<template>
  <div>
    <Navbar></Navbar>
    <b-container class="product-container">
      <h4>Product List</h4>
      <button class="btn btn-primary" @click="handleAdd()">Create Product</button>
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
      <b-form @submit.prevent="onSubmit">
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

        <b-form-group label="Description:" label-for="description">
          <b-form-textarea
            id="textarea"
            v-model="form.description"
            placeholder="Enter description"
            rows="3"
            max-rows="6"
          ></b-form-textarea>
        </b-form-group>

        <b-form-group id="input-group-3" label="Category:" label-for="input-3">
          <b-form-select
            id="input-3"
            v-model="form.product_category_id"
            :options="dataCategory"
            required
          ></b-form-select>
        </b-form-group>

        <b-form-group label="Ingredient:" label-for="ingredient">
          <b-form-input
            id="ingredient"
            v-model="form.ingredient"
            type="text"
            required
            placeholder="Enter ingredient"
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Measurement:" label-for="measurement">
          <b-form-input
            id="measurement"
            v-model="form.measurement"
            type="text"
            required
            placeholder="Enter measurement"
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Size:" label-for="size">
          <b-form-input id="size" v-model="form.size" type="text" required placeholder="Enter size"></b-form-input>
        </b-form-group>

        <b-form-group label="Size Value:" label-for="size_value">
          <b-form-input
            id="size_value"
            v-model="form.size_value"
            type="number"
            required
            placeholder="Enter size value"
          ></b-form-input>
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
        description: "",
        product_category_id: "",
        ingredient: "",
        measurement: "",
        size: "",
        size_value: ""
      },
      perPage: 0,
      currentPage: 1,
      total_pages: 0,
      fields: [
        "name",
        "enable",
        "ingredient",
        "measurement",
        "created_at",
        "updated_at",
        {
          key: "action",
          label: "Action"
        }
      ],
      data: [],
      dataCategory: []
    };
  },
  mounted() {
    axios
      .get("http://pretest-qa.privydev.id/api/v1/product")
      .then(response => {
        this.data = response.data.data;
        this.perPage = response.data.meta.pagination.per_page;
        this.total_pages = response.data.meta.pagination.total_pages;
        this.isBusy = false;
      })
      .catch(err => console.log(err));

    axios
      .get("http://pretest-qa.privydev.id/api/v1/category")
      .then(response => {
        const category = [];

        response.data.data.map((cat, index) => {
          category.push({
            value: cat.id,
            text: cat.name
          });
        });

        this.dataCategory = category;
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
      this.title = "Edit Product";
      this.idData = data.id;
      this.form.name = data.name;
      this.form.enable = data.enable;
      this.form.description = data.description;
      this.form.product_category_id = data.product_category_id;
      this.form.ingredient = data.ingredient;
      this.form.measurement = data.measurement;
      this.form.size = data.size;
      this.form.size_value = data.size_value;
      this.modalShow = true;
    },
    handleAdd() {
      this.isEdit = false;
      this.title = "Create Product";
      this.idData = "";
      this.form.name = "";
      this.form.enable = "";
      this.form.description = "";
      this.form.product_category_id = "";
      this.form.ingredient = "";
      this.form.measurement = "";
      this.form.size = "";
      this.form.size_value = "";
      this.modalShow = true;
    },
    handleDelete(data) {
      axios({
        url: "http://pretest-qa.privydev.id/api/v1/product/" + data.id,
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
            "http://pretest-qa.privydev.id/api/v1/product/" + this.idData,
            this.form
          )
          .then(response => {
            alert("success");
            this.isEdit = false;
            this.isSubmit = false;
            this.modalShow = false;

            axios
              .get("http://pretest-qa.privydev.id/api/v1/product")
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
        if (this.form.enable[0] === true) {
          this.form.enable = true;
        } else {
          this.form.enable = false;
        }
        axios
          .post("http://pretest-qa.privydev.id/api/v1/product", this.form)
          .then(response => {
            alert("success");
            this.isSubmit = false;
            this.modalShow = false;

            axios
              .get("http://pretest-qa.privydev.id/api/v1/product")
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

.btn-delete {
  margin-left: 5px;
}
</style>