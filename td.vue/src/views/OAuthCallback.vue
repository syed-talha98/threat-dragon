<!-- OAuthCallback.vue -->
<template>
  <div>Processing OAuth callback...</div>
</template>

<script>
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import loginAPI from '@/service/api/loginApi.js';

export default {
  setup() {
    const router = useRouter();
    const route = useRoute();

    onMounted(async () => {
    console.log('OAuthCallback.vue mounted');
      const code = new URLSearchParams(window.location.search).get('code');
      const provider = new URLSearchParams(window.location.search).get('provider'); // Assumes provider is passed in the query
      console.log('Code:', code);
console.log('Provider:', provider);
      if (!provider) {
        console.error('Missing provider in the query parameters.');
        router.push({ name: 'HomePage' });
        return;
      }

      if (code) {
        try {
          // Send the provider and authorization code to the backend
          const response = await loginAPI.completeLoginAsync(provider, code);
          console.log('Login completed:', response);

          // Redirect to a secure page or dashboard
          router.push({ name: 'MainDashboard' });
        } catch (error) {
          console.error('Error completing login:', error);
          // Handle error (e.g., show an error message)
        }
      } else {
        console.error('Authorization code not found.');
        router.push({ name: 'HomePage' });
      }
    });
  },
};
</script>
