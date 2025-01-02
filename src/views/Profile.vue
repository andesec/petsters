<template>
  <h2>Profile</h2>
  <form @submit.prevent="saveProfile">
    <div class="form-grid">
      <!-- First Name -->
      <div class="form-group" :class="{ 'has-error': errors.fn }">
        <label for="first-name">First Name:</label>
        <input id="first-name" v-model="profile.fn"/>
        <small v-if="errors.fn" class="error-message">{{ errors.fn }}</small>
      </div>

      <!-- Last Name -->
      <div class="form-group" :class="{ 'has-error': errors.ln }">
        <label for="last-name">Last Name:</label>
        <input id="last-name" v-model="profile.ln"/>
        <small v-if="errors.ln" class="error-message">{{ errors.ln }}</small>
      </div>

      <!-- Email -->
      <div class="form-group" :class="{ 'has-error': errors.e }">
        <label for="email">Email:</label>
        <input id="email" v-model="profile.e" type="email"/>
        <small v-if="errors.e" class="error-message">{{ errors.e }}</small>
      </div>

      <!-- Username -->
      <div class="form-group">
        <label for="username">Username:</label>
        <input id="username" v-model="profile.u" disabled readonly/>
      </div>

      <!-- Bio -->
      <div class="form-group form-full-width">
        <label for="bio">Bio:</label>
        <textarea id="bio" v-model="profile.b"></textarea>
        <small v-if="errors.b" class="error-message">{{ errors.b }}</small>
      </div>

      <!-- Reddit Handle -->
      <div class="form-group" :class="{ 'has-error': errors.rh }">
        <label for="reddit">Reddit Handle:</label>
        <div class="input-with-icon">
          <i class="fab fa-reddit reddit-icon"></i>
          <input id="reddit" v-model="profile.rh" placeholder="u/************************"/>
        </div>
        <small v-if="errors.rh" class="error-message">{{ errors.rh }}</small>
      </div>

      <!-- Discord Handle -->
      <div class="form-group" :class="{ 'has-error': errors.dh }">
        <label for="discord">Discord Handle:</label>
        <div class="input-with-icon">
          <i class="fab fa-discord discord-icon"></i>
          <input id="discord" v-model="profile.dh" placeholder="************************#0000"/>
        </div>
        <small v-if="errors.dh" class="error-message">{{ errors.dh }}</small>
      </div>

      <!-- X Handle -->
      <div class="form-group" :class="{ 'has-error': errors.th }">
        <label for="twitter">X Handle:</label>
        <div class="input-with-icon">
          <i class="fa-brands fa-x-twitter twitter-icon"></i>
          <input id="twitter" v-model="profile.th" placeholder="@***************"/>
        </div>
        <small v-if="errors.th" class="error-message">{{ errors.th }}</small>
      </div>

      <!-- Member Since -->
      <div class="form-group">
        <label for="since">Member Since:</label>
        <input id="since" type="text" :value="memberSinceHumanReadable" disabled/>
      </div>
    </div>

    <!-- Submit Button -->
    <button type="submit">Save</button>
  </form>

</template>

<script>
import ApiService from '../services/ApiService';
import UXService from "@/services/UXService.js";

export default {
  data() {
    return {
      profile: {
        fn: "",
        ln: "",
        e: "",
        u: "",
        b: "",
        rh: null,
        dh: null,
        th: null,
        ms: 0, // Epoch timestamp from API
      },
      errors: {},
    };
  },
  async mounted() {
    try {
      const response = await ApiService.makeRequest('/profile', 'GET');
      this.profile = response;
    } catch (error) {
      UXService.notify("an error occurred while fetching profile", error);
    }
  },
  computed: {
    memberSinceHumanReadable() {
      if (!this.profile.ms || this.profile.ms <= 0) return "N/A";

      const memberSince = new Date(this.profile.ms * 1000); // Assuming timestamp is in seconds
      const now = new Date();

      let years = now.getFullYear() - memberSince.getFullYear();
      let months = now.getMonth() - memberSince.getMonth();
      let days = now.getDate() - memberSince.getDate();

      // Adjust days if negative
      if (days < 0) {
        months -= 1;
        const daysInPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
        days += daysInPrevMonth;
      }

      // Adjust months if negative
      if (months < 0) {
        years -= 1;
        months += 12;
      }

      // Handle edge case: Same day
      if (years === 0 && months === 0 && days === 0) {
        return "0 days";
      }

      // Build the combined string
      let combinedString = "";
      if (years > 0) {
        combinedString += `${years} years, `;
      }
      if (months > 0) {
        combinedString += `${months} months, `;
      }
      combinedString += `${days} days`;

      // Trim trailing comma and space if it exists
      return combinedString.trim().replace(/,$/, "");
    },
  },
  methods: {
    validateProfile() {
      const errors = {};

      // First Name and Last Name: Required
      if (!this.profile.fn.trim()) {
        errors.fn = "First Name is required.";
      }
      if (!this.profile.ln.trim()) {
        errors.ln = "Last Name is required.";
      }

      // Email: Must be a valid email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!this.profile.e.trim()) {
        errors.e = "Email is required.";
      } else if (!emailRegex.test(this.profile.e)) {
        errors.e = "Invalid email format.";
      }

      // Reddit Handle: Must start with "u/" and have characters following it
      if (this.profile.rh && !/^u\/[a-zA-Z0-9_-]+$/.test(this.profile.rh)) {
        errors.rh = "Reddit handle must start with 'u/' and contain valid characters.";
      }

      // Discord Handle: Must be in the format username#1234
      if (this.profile.dh && !/^[a-zA-Z0-9_-]{2,32}#[0-9]{4}$/.test(this.profile.dh)) {
        errors.dh = "Discord handle must be in the format 'username#1234'.";
      }

      // X Handle: Must start with '@' and cannot be empty
      if (this.profile.th && !/^@[a-zA-Z0-9_-]+$/.test(this.profile.th)) {
        errors.th = "X (Twitter) handle must start with '@' and contain valid characters.";
      }

      // Return errors
      this.errors = errors;
      return Object.keys(errors).length === 0; // Valid if no errors
    },

    async saveProfile() {
      // Validate profile before processing
      if (!this.validateProfile()) {
        alert("Please fix the validation errors before saving.");
        return;
      }

      // Preprocess: Set empty fields to null
      const processedProfile = {...this.profile};
      Object.keys(processedProfile).forEach((key) => {
        if (processedProfile[key] === "" || processedProfile[key] === undefined) {
          processedProfile[key] = null;
        }
      });

      // Send the processed profile to the API
      try {
        await ApiService.makeRequest("/profile", "POST", processedProfile);
        alert("Profile saved successfully!");
      } catch (error) {
        UXService.notify("an error occurred while saving profile", error);
      }
    },
  },
};
</script>

<style scoped>

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Two columns */
  gap: 30px 40px; /* Increased margin between columns and rows */
}

@media (max-width: 450px) {
  .form-grid {
    display: inline;
  }
}

.form-full-width {
  grid-column: span 2; /* Make full width for larger fields like Bio */
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

textarea {
  resize: vertical;
}

.reddit-icon {
  color: #ef2c0a; /* Reddit orange */
}

.discord-icon {
  color: #5865F2; /* Discord blue */
}

.twitter-icon {
  color: black; /* X (formerly Twitter) now uses black */
}

/* Optional: Adjust icon size */
.input-with-icon i {
  font-size: 20px;
  margin-right: 10px;
}

.input-with-icon {
  display: flex;
  align-items: center;
}

button {
  margin-top: 20px;
  background-color: #3f51b5;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
}

button:hover {
  background-color: #303f9f;
}

/* General error message styling */
.error-message {
  color: red;
  font-size: 0.85rem;
  margin-top: 4px;
  display: block; /* Ensures the error appears below the field */
}

/* Highlight fields with errors */
.has-error input {
  border: 1px solid red;
  background-color: #ffe6e6; /* Optional: A light red background for better visibility */
}

/* Style input fields generally */
input, textarea {
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 95%;
  padding: 5px;
  transition: border-color 0.2s;
}

textarea {
  width: 98%;
}

input:focus {
  border-color: #3f51b5; /* Highlight field on focus */
}

@media (max-width: 600px) {
  .form-grid {
    grid-template-columns: 1fr; /* Single column layout on small screens */
  }
}
</style>