<template>
  <div class="container">
    <b-form @submit.prevent="onSubmit" @reset="onReset">
      <b-form-group id="input-group-2" label="Apartment Name:" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model="Apartment.name"
          placeholder="Enter apartment name"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-3" label="Location:" label-for="input-3">
        <b-form-input
          id="input-3"
          v-model="Apartment.location"
          placeholder="Enter location"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-4" label="Price:" label-for="input-4">
        <b-form-input
          id="input-4"
          v-model="Apartment.price"
          type="number"
          step="0.01"
          placeholder="Enter price"
          required
        ></b-form-input>
      </b-form-group>

      <div class="button-container">
        <b-button class="custom-button" type="submit" variant="primary">Submit</b-button>
        <b-button class="custom-button" type="reset" variant="danger">Reset</b-button>
      </div>
    </b-form>
  </div>
</template>

<script>
import { initializeWeb3, getWeb3 } from '../web3Service';
import { initContract, getContract } from '../contractService';

export default {
  data() {
    return {
      Apartment: {
        name: "",
        location: "",
        price: "",
      },
    };
  },

  async created() {
    try {
      this.web3 = await initializeWeb3();
      console.log("web3: ", this.web3)

      this.contract = await initContract();
      console.log("contract", this.contract )

    } catch (error) {
      console.error('Error initializing contract:', error);
    }
  },

  methods: {
    async onSubmit() {
      try {
        const accounts = await this.web3.eth.getAccounts();
        console.log(accounts)
        console.log(this.contract)
        await this.contract.methods
          .createApartment(
            this.Apartment.name,
            this.Apartment.location,
            this.web3.utils.toWei(this.Apartment.price, "ether")
          )
          .send({ from: accounts[0] });

        this.Apartment = {
          name: "",
          location: "",
          price: "",
        };

        //await this.loadApartments();
      } catch (error) {
        console.error("Error creating apartment:", error);
      }
    },

    onReset() {
      this.Apartment = {
        name: "",
        location: "",
        price: "",
      };
    }
  }
};
</script>

<style scoped>
.container {
  margin: 20px auto;
  max-width: 600px;
  padding: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.b-form-group {
  margin-bottom: 1rem;
}

.custom-button {
  border-radius: 4px; /* Slightly rounded corners for a modern look */
  padding: 0.5rem 1rem;
  margin-left: 10px;
  min-width: 120px; /* Ensure buttons are wider and more square */
}

.button-container {
  text-align: right;
  margin-top: 1rem;
}

.b-form-input {
  border-radius: 4px;
}

.b-form-group label {
  font-weight: bold;
}

.b-form-input, .b-form-select {
  border-radius: 4px;
}
</style>
