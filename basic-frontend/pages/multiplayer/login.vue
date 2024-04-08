<template>
    <div class="min-h-screen flex items-center justify-center w-full ">
        <div class="bg-white  shadow-md rounded-lg px-8 py-6 max-w-md">
            <h1 class="text-2xl font-bold text-center mb-4 ">Welcome Back!</h1>
            <form @submit.prevent="login">
                <div class="mb-4">
                    <label for="email" class="block text-sm font-medium text-gray-700  mb-2">Email
                        Address</label>
                    <input type="email" id="email" v-model="form.email"
                        class="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="your@email.com" required>
                </div>
                <div class="mb-4">
                    <label for="password" class="block text-sm font-medium text-gray-700  mb-2">Password</label>
                    <input type="password" id="password" v-model="form.password"
                        class="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter your password" required>
                    <a href="#"
                        class="text-xs text-gray-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Forgot
                        Password?</a>
                </div>
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center">
                        <input type="checkbox" id="remember" v-model="form.remember"
                            class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 focus:outline-none"
                            checked>
                        <label for="remember" class="ml-2 block text-sm text-gray-700 ">Remember
                            me</label>
                    </div>
                    <NuxtLink to="/multiplayer/signup"
                        class="text-xs text-indigo-500 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Create
                        Account
                    </NuxtLink>

                </div>
                <button type="submit"
                    class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <span v-if="loading">
                        <MiscLoading />
                    </span>
                    <span v-else>
                        Login
                    </span>
                </button>
            </form>
        </div>
    </div>
</template>

<script setup lang="js">
const form = ref({
    email: "",
    password: "",
    remember: false,
});

definePageMeta({
    middleware: "guest",
});

const router = useRouter()
const route = useRoute()


const isPasswordVisible = ref(false);

const loading = ref(false);


const login = async () => {
    loading.value = true;
    try {
        const res = await $api("/api/auth/login", {
            method: "POST",
            body: {
                email: form.value.email,
                password: form.value.password,
                remember: form.value.remember,
            },
            onResponseError({ response }) {
                alert('error')
            },
        });
        push.success('Logged in successfully')
        console.log("response >>>", res);
        const { accessToken, userData } = res;
        useCookie("userData").value = userData;
        useCookie("accessToken").value = accessToken;
        nextTick(async () => {
            await goto('/multiplayer')
        })
    } catch (error) {
        console.log("Error res >>>", error)
    }
    finally {
        loading.value = false
    }
};

const goto = async (path) => {
    await router.push(path)
    router.go(0)
}


</script>